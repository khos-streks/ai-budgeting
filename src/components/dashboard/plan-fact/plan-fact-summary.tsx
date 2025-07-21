'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDateContext } from '@/contexts/date-context'
import { usePlanFactSummary } from '@/hooks/usePlanFact'
import { ReactNode } from 'react'
import { AnomaliesItem } from './anomalies-item'
import { SummaryItem } from './summary-item'
import { SummaryData } from './summary-utils'
import { useBudgetCounts } from '@/hooks/useBudgeting'

// Main component
export function PlanFactSummary() {
	const { dateRange } = useDateContext()
	const { data: budgetCounts, isLoading: isBudgetCountsLoading } = useBudgetCounts()
	const { data, isLoading: isPlanFactLoading } = usePlanFactSummary(
		dateRange.startDate,
		dateRange.endDate,
		dateRange.budgetVersion?.version
	)

	const isLoading = isBudgetCountsLoading || isPlanFactLoading

	// Handler for rendering different types of summary items
	const renderSummaryItem = (
		key: string,
		value: any,
		data: SummaryData
	): ReactNode => {
		if (key === 'anomalies_count') {
			return (
				<AnomaliesItem key={key} value={value} anomalies={data.anomalies} />
			)
		}
		return <SummaryItem key={key} itemKey={key} value={value} />
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Узагальнена інформація за період "{dateRange.startDate}" - "
					{dateRange.endDate}"
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className='flex items-center justify-center p-6'>
						<span className='font-bold'>Завантаження...</span>
					</div>
				) : data && budgetCounts ? (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{Object.entries({ ...data, budget_counts: budgetCounts.count })
							?.filter(([key]) => key !== 'anomalies')
							.map(([key, value]) => renderSummaryItem(key, value, data)	)}
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
