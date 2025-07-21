'use client'

import {
	useGetKeyIndicators,
	useKeyIndicatorsFilters,
} from '@/hooks/usePlanFact'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
import { useEffect, useState } from 'react'
import { useDateContext } from '@/contexts/date-context'
import { ExcelHtmlViewer } from '../ui/excel-viewer'

export function KeyIndicators() {
	const { data: filters, isLoading: isFiltersLoading } = useKeyIndicatorsFilters()
	const { dateRange } = useDateContext()

	const [currentIndicator, setCurrentIndicator] = useState<string>('')

	useEffect(() => {
		if (filters?.indicator?.length) {
			setCurrentIndicator(filters.indicator[0])
		}
	}, [filters])

	const { data: keyIndicators, isLoading: isKeyIndicatorsLoading } =
		useGetKeyIndicators(dateRange?.budgetVersion?.id, currentIndicator)

	const isLoading = isFiltersLoading || isKeyIndicatorsLoading || !dateRange?.budgetVersion

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ключові показники</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{isFiltersLoading && <div className="text-sm text-muted-foreground">Завантаження фільтрів…</div>}

				{!isFiltersLoading && filters?.indicator && filters?.indicator?.length > 0 && (
					<Select value={currentIndicator} onValueChange={setCurrentIndicator}>
						<SelectTrigger className="max-w-full break-words truncate">
							<SelectValue placeholder="Оберіть індикатор" />
						</SelectTrigger>
						<SelectContent>
							{filters.indicator.map(indicator => (
								<SelectItem key={indicator} value={indicator}>
									{indicator}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				{isLoading ? (
					<div className="text-sm text-muted-foreground">Завантаження даних…</div>
				) : keyIndicators ? (
					<ExcelHtmlViewer file={keyIndicators} />
				) : (
					<div className="text-sm text-muted-foreground">Дані відсутні</div>
				)}
			</CardContent>
		</Card>
	)
}
