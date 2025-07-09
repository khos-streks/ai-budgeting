'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExcelHtmlViewer } from '@/components/ui/excel-viewer'
import { useDateContext } from '@/contexts/date-context'
import { usePlanFactTable } from '@/hooks/usePlanFact'
import { DownloadIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function PlanFactTable() {
	const { planFactDateRange } = useDateContext()
	const { data: fileData, isLoading } = usePlanFactTable(
		planFactDateRange.startDate,
		planFactDateRange.endDate
	)
	const [fileUrl, setFileUrl] = useState<string | null>(null)

	// Create a URL for the blob when fileData changes
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
				<CardTitle>Основна таблиця (план-факт аналіз)</CardTitle>
				{fileUrl && (
					<a
						href={fileUrl}
						download={`plan-fact-analysis-${planFactDateRange.startDate}-${planFactDateRange.endDate}.xlsx`}
					>
						<Button><DownloadIcon /> Завантажити Excel файл</Button>
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
					<span>Немає даних. Спробуйте інші дати</span>
				)}
			</CardContent>
		</Card>
	)
}
