'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ExcelHtmlViewer } from '@/components/ui/excel-viewer'
import {
	AdvancedFilters,
	QuickFilters,
	TableHeader,
} from '@/components/ui/table-filters'
import { useDateContext } from '@/contexts/date-context'
import { useMainTableFilters, usePlanFactTable } from '@/hooks/usePlanFact'
import { useTableFilters } from '@/hooks/useTableFilters'
import { PLAN_FACT_QUICK_FILTERS, PlanFactFilters } from '@/typing/filters'
import { useEffect, useState } from 'react'
import { SortingInfo } from './sorting-info'

export function PlanFactTable() {
	const { dateRange } = useDateContext()
	const { data: filterOptions, isLoading: filtersLoading } =
		useMainTableFilters()
	const [fileUrl, setFileUrl] = useState<string | null>(null)

	const {
		filters,
		isFiltersExpanded,
		hasActiveFilters,
		handleFilterChange,
		clearAllFilters,
		applyQuickFilter,
		toggleFiltersExpanded,
	} = useTableFilters(PLAN_FACT_QUICK_FILTERS)

	const { data: fileData, isLoading } = usePlanFactTable(
		dateRange.startDate,
		dateRange.endDate,
		dateRange.budgetVersion,
		filters as PlanFactFilters
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
					title='Основна таблиця (план-факт аналіз)'
					filters={filters}
					hasActiveFilters={hasActiveFilters}
					fileUrl={fileUrl}
					dateRange={dateRange}
					onClearFilters={clearAllFilters}
					onToggleFilters={toggleFiltersExpanded}
					isFiltersExpanded={isFiltersExpanded}
				/>
			</CardHeader>

			<CardContent className='pt-0'>
				{/* Quick Filter Buttons */}
				<QuickFilters
					presets={PLAN_FACT_QUICK_FILTERS}
					onQuickFilter={applyQuickFilter}
				/>

				{/* Sorting Info */}
				<SortingInfo />

				{/* Advanced Filters */}
				{isFiltersExpanded && (
					<div className='mb-6'>
						<AdvancedFilters
							filters={filters}
							filterOptions={filterOptions}
							isLoading={filtersLoading}
							onFilterChange={handleFilterChange}
							showSorting={false}
							showBudgetObject={false}
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
