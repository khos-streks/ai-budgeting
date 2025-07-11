'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ExcelHtmlViewer } from '@/components/ui/excel-viewer'
import {
	AdvancedFilters,
	QuickFilters,
	TableHeader,
} from '@/components/ui/table-filters'
import { useDateContext } from '@/contexts/date-context'
import { useTableFilters } from '@/hooks/useTableFilters'
import {
	CONSOLIDATED_QUICK_FILTERS,
	ConsolidatedFilters,
	FilterOptions,
} from '@/typing/filters'
import { useEffect, useState } from 'react'

// Mock hook for consolidated table data
function useConsolidatedTable(
	startDate: string,
	endDate: string,
	budgetVersion?: string,
	filters?: ConsolidatedFilters
) {
	// This would be replaced with actual API call
	return {
		data: null as Blob | null,
		isLoading: false,
	}
}

// Mock hook for consolidated table filters
function useConsolidatedTableFilters() {
	// This would be replaced with actual API call
	return {
		data: {
			budget: ['Бюджет 1', 'Бюджет 2'],
			budget_item: ['Стаття 1', 'Стаття 2'],
			cfo: ['ЦФО 1', 'ЦФО 2'],
			org: ['Організація 1', 'Організація 2'],
			macro_item: ['Макростаття 1', 'Макростаття 2'],
			budget_object: ['Експорт', 'Україна', 'Украина', 'Экспорт'],
		} as FilterOptions,
		isLoading: false,
	}
}

export function ConsolidatedTable() {
	const { dateRange } = useDateContext()
	const { data: filterOptions, isLoading: filtersLoading } =
		useConsolidatedTableFilters()
	const [fileUrl, setFileUrl] = useState<string | null>(null)

	const {
		filters,
		isFiltersExpanded,
		hasActiveFilters,
		handleFilterChange,
		clearAllFilters,
		applyQuickFilter,
		toggleFiltersExpanded,
	} = useTableFilters(CONSOLIDATED_QUICK_FILTERS)

	const { data: fileData, isLoading } = useConsolidatedTable(
		dateRange.startDate,
		dateRange.endDate,
		dateRange.budgetVersion,
		filters as ConsolidatedFilters
	)

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
			<CardHeader>
				<TableHeader
					title='Зведена таблиця бюджету'
					filters={filters}
					hasActiveFilters={hasActiveFilters}
					fileUrl={fileUrl}
					dateRange={dateRange}
					onClearFilters={clearAllFilters}
					onToggleFilters={toggleFiltersExpanded}
					isFiltersExpanded={isFiltersExpanded}
					downloadFileName='consolidated-budget'
				/>
			</CardHeader>

			<CardContent className='pt-0'>
				{/* Quick Filter Buttons */}
				<QuickFilters
					presets={CONSOLIDATED_QUICK_FILTERS}
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
							showSorting={true}
							showBudgetObject={true}
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
