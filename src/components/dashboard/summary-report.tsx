'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInfoContext } from '@/contexts/info-context'
import { useGetSummaryReport } from '@/hooks/usePlanFact'

export function SummaryReport() {
	const { startDate, endDate, budgetVersion } = useInfoContext()
	const { data, isLoading, isError } = useGetSummaryReport(
		startDate,
		endDate,
		budgetVersion?.version
	)

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Стандартизований звіт</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-muted-foreground'>Завантаження…</div>
				</CardContent>
			</Card>
		)
	}

	if (!isLoading && (!isError || !data)) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Стандартизований звіт</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='text-muted-foreground'>Не співпадає план/факт</div>
				</CardContent>
			</Card>
		)
	}

	return (
		data && (
			<Card>
				<CardHeader>
					<CardTitle>Стандартизований звіт</CardTitle>
					<p className='text-muted-foreground'>
						Аналіз бюджету за поточний період
					</p>
				</CardHeader>
				<CardContent className='space-y-6'>
					<div>
						<h3 className='text-lg font-semibold mb-4'>Основні висновки:</h3>
						<ul className='list-disc pl-5 space-y-2'>
							<li>✅ Загальне виконання плану {data.execution_percent}%</li>
							{data.main_causes.map((cause, idx) => (
								<li key={idx}>{cause}</li>
							))}
						</ul>
					</div>

					<div className='flex items-center gap-2 flex-wrap'>
						<h3 className='text-lg font-semibold'>Рекомендація:</h3>
						<span>{data.recommendations}</span>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<h3 className='text-lg font-semibold mb-2'>
								Найбільше позитивне відхилення
							</h3>
							<div className='bg-green-50 rounded p-3'>
								<div className='font-medium'>
									{data.top_positive_deviation.budget_item}
								</div>
								<div>
									План:{' '}
									<span className='font-bold'>
										{data.top_positive_deviation.plan_amount.toLocaleString()}
									</span>
								</div>
								<div>
									Факт:{' '}
									<span className='font-bold'>
										{data.top_positive_deviation.fact_amount.toLocaleString()}
									</span>
								</div>
								<div>
									Відхилення:{' '}
									<span className='font-bold text-green-600'>
										{data.top_positive_deviation.deviation_amount.toLocaleString()}
									</span>{' '}
									({data.top_positive_deviation.deviation_percent}%)
								</div>
							</div>
						</div>

						<div>
							<h3 className='text-lg font-semibold mb-2'>
								Найбільше негативне відхилення
							</h3>
							<div className='bg-red-50 rounded p-3'>
								<div className='font-medium'>
									{data.top_negative_deviation.budget_item}
								</div>
								<div>
									План:{' '}
									<span className='font-bold'>
										{data.top_negative_deviation.plan_amount.toLocaleString()}
									</span>
								</div>
								<div>
									Факт:{' '}
									<span className='font-bold'>
										{data.top_negative_deviation.fact_amount.toLocaleString()}
									</span>
								</div>
								<div>
									Відхилення:{' '}
									<span className='font-bold text-red-600'>
										{data.top_negative_deviation.deviation_amount.toLocaleString()}
									</span>{' '}
									({data.top_negative_deviation.deviation_percent}%)
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	)
}
