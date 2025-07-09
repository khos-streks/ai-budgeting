'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExcelHtmlViewer } from '@/components/ui/excel-viewer'
import { useDateContext } from '@/contexts/date-context'
import { useSummaryData } from '@/hooks/useBudgeting'
import { DownloadIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SummaryTable() {
	const { budgetingDateRange } = useDateContext()
	const { data: fileData, isLoading } = useSummaryData(
		budgetingDateRange.startDate,
		budgetingDateRange.endDate
	)

	const [fileUrl, setFileUrl] = useState<string | null>(null)

	useEffect(() => {
		if (fileData instanceof Blob) {
			const url = URL.createObjectURL(fileData)
			setFileUrl(url)
			return () => {
				URL.revokeObjectURL(url)
			}
		}
	}, [fileData])

	return (
		<Card className='w-full overflow-hidden'>
			<CardHeader className='flex gap-5 items-center'>
				<CardTitle>Зведена таблиця</CardTitle>
				{fileUrl && (
					<a
						href={fileUrl}
						download={`consolidated-table-${budgetingDateRange.startDate}-${budgetingDateRange.endDate}.xlsx`}
					>
						<Button>
							<DownloadIcon /> Завантажити Excel файл
						</Button>
					</a>
				)}
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
