'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExcelHtmlViewer } from '@/components/ui/excel-viewer'
import { useDateContext } from '@/contexts/date-context'
import { useSummaryData } from '@/hooks/useBudgeting'

export function SummaryTable() {
	const { budgetingDateRange } = useDateContext()
	const { data: fileData, isLoading } = useSummaryData(
		budgetingDateRange.startDate,
		budgetingDateRange.endDate
	)

	return (
		<Card className='w-full overflow-hidden'>
			<CardHeader>
				<CardTitle>Зведена таблиця</CardTitle>
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
