'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExcelHtmlViewer } from '@/components/ui/excel-viewer'
import { useDateContext } from '@/contexts/date-context'
import { usePlanFactTable } from '@/hooks/usePlanFact'

export function PlanFactTable() {
	const { planFactDateRange } = useDateContext()
	const { data: fileData, isLoading } = usePlanFactTable(
		planFactDateRange.startDate,
		planFactDateRange.endDate
	)

	return (
		<Card className='w-full overflow-hidden'>
			<CardHeader>
				<CardTitle>Основна таблиця (план-факт аналіз)</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<>
						<span className='font-bold'>Статус:</span> Завантаження...
					</>
				) : fileData ? (
					<ExcelHtmlViewer file={fileData} />
				) : (
					<span>Немає даних</span>
				)}
			</CardContent>
		</Card>
	)
}
