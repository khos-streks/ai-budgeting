'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDateContext } from '@/contexts/date-context'
import { useTopDeviations } from '@/hooks/usePlanFact'

export const TopDeviations = () => {
	const { dateRange } = useDateContext()
	const { data } = useTopDeviations(
		dateRange.startDate,
		dateRange.endDate,
		dateRange.budgetVersion
	)

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
				<Tabs defaultValue='negative' className='w-full'>
					<TabsList className='grid w-full grid-cols-2 max-lg:grid-cols-1 max-lg:h-24'>
						<TabsTrigger value='negative'>Негативні відхилення</TabsTrigger>
						<TabsTrigger value='positive'>Позитивні відхилення</TabsTrigger>
					</TabsList>
					<TabsContent value='negative' className='space-y-4'>
						{data?.negative?.map((item, index) => (
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
						))}
					</TabsContent>
					<TabsContent value='positive' className='space-y-4'>
						{data?.positive?.map((item, index) => (
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
						))}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
