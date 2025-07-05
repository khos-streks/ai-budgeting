'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDateContext } from '@/contexts/date-context'
import { useTopDeviations } from '@/hooks/usePlanFact'

export const TopDeviations = () => {
	const { planFactDateRange } = useDateContext()
	const { data } = useTopDeviations(
		planFactDateRange.startDate,
		planFactDateRange.endDate
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
						<TabsTrigger value='negative'>
							Найбільші негативні відхилення
						</TabsTrigger>
						<TabsTrigger value='positive'>
							Найбільші позитивні відхилення
						</TabsTrigger>
					</TabsList>

					<TabsContent value='negative'>
						<div className='space-y-4 mt-4'>
							{data?.negative.map((item, index) => (
								<div key={index} className='border rounded-lg p-4 shadow-sm'>
									<div className='flex justify-between items-center mb-2 max-lg:flex-col max-lg:items-start'>
										<h3 className='text-lg font-medium'>{item.budget_item}</h3>
										<div>
											<span className='text-red-600 font-bold'>
												{formatCurrency(item.deviation_amount)}
											</span>{' '}
											<span className='text-red-600 font-medium'>
												({formatPercent(item.deviation_percent)})
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</TabsContent>

					<TabsContent value='positive'>
						<div className='space-y-4 mt-4'>
							{data?.positive.map((item, index) => (
								<div key={index} className='border rounded-lg p-4 shadow-sm'>
									<div className='flex justify-between items-center mb-2 max-lg:flex-col max-lg:items-start'>
										<h3 className='text-lg font-medium'>{item.budget_item}</h3>
										<div>
											<span className='text-green-600 font-bold'>
												{formatCurrency(item.deviation_amount)}
											</span>{' '}
											<span className='text-green-600 font-medium'>
												({formatPercent(item.deviation_percent)})
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
