'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ExcelHtmlViewer } from '@/components/ui/excel-viewer'
import { useDateContext } from '@/contexts/date-context'
import { useConsolidatedFilters, useSummaryData } from '@/hooks/useBudgeting'
import { useTableFilters } from '@/hooks/useTableFilters'
import { useEffect, useState } from 'react'
import {
	AdvancedFilters,
	QuickFilters,
	TableHeader,
} from '@/components/ui/table-filters'

export function SummaryTable() {
	const { dateRange } = useDateContext()
	const { data: filterOptions, isLoading: filtersLoading } =
		useConsolidatedFilters()

	const {
		filters,
		isFiltersExpanded,
		hasActiveFilters,
		handleFilterChange,
		clearAllFilters,
		applyQuickFilter,
		toggleFiltersExpanded,
	} = useTableFilters()

	const { data: fileData, isLoading } = useSummaryData(
		dateRange.startDate,
		dateRange.endDate,
		dateRange.budgetVersion,
		filters
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
				<TableHeader
					title='Зведена таблиця'
					filters={filters}
					hasActiveFilters={hasActiveFilters}
					fileUrl={fileUrl}
					dateRange={dateRange}
					onClearFilters={clearAllFilters}
					onToggleFilters={toggleFiltersExpanded}
					isFiltersExpanded={isFiltersExpanded}
				/>
			</CardHeader>

			<CardContent>
				<QuickFilters
					onQuickFilter={applyQuickFilter}
				/>

				{/* Advanced Filters */}
				{isFiltersExpanded && (
					<div className='mb-6'>
						<AdvancedFilters
							filters={filters}
							filterOptions={filterOptions}
							isLoading={filtersLoading}
							onFilterChange={handleFilterChange}
							showBudgetObject
							showSorting
						/>
					</div>
				)}

				{/* Table Content */}
				{isLoading ? (
					<>
						<span className='font-bold'>Статус:</span> Завантаження...
					</>
				) : fileData ? (
					<ExcelHtmlViewer file={fileData} />
				) : (
					<span>Немає даних. Спробуйте інші дати або змініть фільтри</span>
				)}
			</CardContent>
		</Card>
	)
}
