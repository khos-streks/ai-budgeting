'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDateContext } from '@/contexts/date-context'
import {
	useGetBudgetTypes,
	useGetLogisticsTypes,
	useGetQuantityMetrics,
	useTopDeviations,
} from '@/hooks/usePlanFact'
import { useEffect, useState } from 'react'
import { ExcelHtmlViewer } from '../ui/excel-viewer'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'

export const TopDeviations = () => {
	const { dateRange } = useDateContext()
	const [currentBudgetType, setCurrentBudgetType] = useState<
		{ key: string; label: string } | undefined
	>(undefined)
	const [selectedLogisticType, setSelectedLogisticType] = useState<
		string | undefined
	>(undefined)
	const { data: budgetTypes, isLoading: isBudgetTypesLoading } =
		useGetBudgetTypes()
	const { data: logisticTypes, isLoading: isLogisticTypesLoading } =
		useGetLogisticsTypes()
	const { data, isLoading: isTopDeviationsLoading } = useTopDeviations(
		dateRange.startDate,
		dateRange.endDate,
		currentBudgetType,
		dateRange.budgetVersion?.version
	)

	useEffect(() => {
		if (budgetTypes?.length) {
			setCurrentBudgetType(budgetTypes[0])
		}
	}, [budgetTypes])

	useEffect(() => {
		if (logisticTypes?.length) {
			setSelectedLogisticType(logisticTypes[0].key)
		}
	}, [logisticTypes])

	const { data: quantityMetricsXlsx, isLoading: isQuantityMetricsLoading } =
		useGetQuantityMetrics(selectedLogisticType)

	const isLoading = isBudgetTypesLoading || isTopDeviationsLoading

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('uk-UA', {
			style: 'currency',
			currency: 'UAH',
		}).format(amount)
	}

	const formatPercent = (percent: number) => {
		return `${percent.toFixed(2)}%`
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>ТОП-4 статті витрат по бюджетам</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div>Завантаження даних...</div>
				) : budgetTypes?.length && !!data ? (
					<>
						<Select
							value={currentBudgetType?.key}
							onValueChange={e => {
								setCurrentBudgetType(budgetTypes?.find(i => i.key === e))
							}}
						>
							<SelectTrigger>
								{currentBudgetType?.label ?? budgetTypes?.[0].label}
							</SelectTrigger>
							<SelectContent>
								{budgetTypes?.map((bt, i) => (
									<SelectItem value={bt.key} key={bt.key}>
										{bt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Tabs defaultValue='negative' className='w-full mt-2'>
							<TabsList className='grid w-full grid-cols-2 max-sm:grid-cols-1 max-sm:h-24'>
								<TabsTrigger value='negative'>Негативні відхилення</TabsTrigger>
								<TabsTrigger value='positive'>Позитивні відхилення</TabsTrigger>
							</TabsList>
							<TabsContent value='negative' className='space-y-4'>
								{data.negative.length > 0 ? (
									data.negative.map((item, index) => (
										<div
											key={index}
											className='flex justify-between items-center p-3 bg-red-50 rounded-lg'
										>
											<div className='flex-1'>
												<div className='font-medium text-red-900'>
													{item.budget_item}
												</div>
												<div className='text-sm text-red-700'>
													Відхилення: {formatCurrency(item.deviation_amount)} (
													{formatPercent(item.deviation_percent)})
												</div>
											</div>
										</div>
									))
								) : (
									<div>
										Немає жодної інформації про негативні відхилення в "
										{currentBudgetType?.label}`
									</div>
								)}
							</TabsContent>
							<TabsContent value='positive' className='space-y-4'>
								{data.positive.length > 0 ? (
									data.positive.map((item, index) => (
										<div
											key={index}
											className='flex justify-between items-center p-3 bg-green-50 rounded-lg'
										>
											<div className='flex-1'>
												<div className='font-medium text-green-900'>
													{item.budget_item}
												</div>
												<div className='text-sm text-green-700'>
													Відхилення: {formatCurrency(item.deviation_amount)} (
													{formatPercent(item.deviation_percent)})
												</div>
											</div>
										</div>
									))
								) : (
									<div>
										Немає жодної інформації про позитивні відхилення в "
										{currentBudgetType?.label}"
									</div>
								)}
							</TabsContent>
						</Tabs>
						{/* XLSX quantity metrics rendering with logistic type select */}
						<div className='mt-6'>
							<div className='font-semibold mb-2'>
								Кількісні показники (Excel)
							</div>
							<div className='mb-2 max-w-xs'>
								<Select
									value={selectedLogisticType}
									onValueChange={setSelectedLogisticType}
								>
									<SelectTrigger>
										{logisticTypes?.find(l => l.key === selectedLogisticType)
											?.label || 'Оберіть тип логістики'}
									</SelectTrigger>
									<SelectContent>
										{logisticTypes?.map(l => (
											<SelectItem value={l.key} key={l.key}>
												{l.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							{isQuantityMetricsLoading ? (
								<div>Завантаження метрик...</div>
							) : quantityMetricsXlsx ? (
								<ExcelHtmlViewer file={quantityMetricsXlsx} />
							) : (
								<div>Немає кількісних метрик для цього типу логістики</div>
							)}
						</div>
					</>
				) : (
					<div>Помилка завантаження даних. Спробуйте будь ласка пізніше</div>
				)}
			</CardContent>
		</Card>
	)
}
