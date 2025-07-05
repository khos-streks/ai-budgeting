'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDateContext } from '@/contexts/date-context'
import { usePlanFactSummary } from '@/hooks/usePlanFact'

export function PlanFactSummary() {
	const { planFactDateRange } = useDateContext()
	const { data, isLoading } = usePlanFactSummary(
		planFactDateRange.startDate,
		planFactDateRange.endDate
	)

	const getLabel = (key: string) => {
		switch (key) {
			case 'total_plan':
				return 'Загальний план'
			case 'plan_change_percent':
				return 'Зміна плану'
			case 'execution_percent':
				return 'Виконання'
			case 'anomalies_count':
				return 'Аномалії'
			default:
				return key
		}
	}

	// Function to format the value based on the key
	const formatValue = (key: string, value: any) => {
		if (key === 'total_plan') {
			return new Intl.NumberFormat('uk-UA', {
				style: 'currency',
				currency: 'UAH',
			}).format(Number(value))
		}
		if (key === 'plan_change_percent' || key === 'execution_percent') {
			return `${Number(value).toFixed(2)}%`
		}
		return value
	}

	// Function to get numeric value for comparisons
	const getNumericValue = (value: any): number => {
		return value !== undefined && value !== '' ? Number(value) : 0
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Узагальнена інформація</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='flex items-center justify-center p-6'>
						<span className='font-bold'>Завантаження...</span>
					</div>
				) : data ? (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{Object.entries(data ?? {}).map(([key, value]) => (
							<div
								key={key}
								className='bg-card border rounded-lg p-4 flex flex-col shadow-sm'
							>
								<div className='text-sm text-muted-foreground mb-1'>
									{getLabel(key)}
								</div>
								<div
									className={`text-2xl font-bold ${
										key === 'execution_percent' && getNumericValue(value) > 100
											? 'text-green-600'
											: key === 'execution_percent' &&
											  getNumericValue(value) < 100
											? 'text-red-600'
											: key === 'anomalies_count' && getNumericValue(value) > 0
											? 'text-amber-600'
											: ''
									}`}
								>
									{value !== undefined ? formatValue(key, value) : 'Н/Д'}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='flex items-center justify-center p-6'>
						<span className='text-muted-foreground'>Немає даних</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
