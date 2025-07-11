'use client'

import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { ConsolidatedFilters, PlanFactFilters } from '@/typing/filters'
import { DownloadIcon, FilterIcon, X } from 'lucide-react'

interface TableHeaderProps {
	title: string
	filters: PlanFactFilters | ConsolidatedFilters
	hasActiveFilters: boolean
	fileUrl: string | null
	dateRange: { startDate: string; endDate: string }
	onClearFilters: () => void
	onToggleFilters: () => void
	isFiltersExpanded: boolean
	downloadFileName?: string
}

export function TableHeader({
	title,
	filters,
	hasActiveFilters,
	fileUrl,
	dateRange,
	onClearFilters,
	onToggleFilters,
	isFiltersExpanded,
	downloadFileName = 'table-data',
}: TableHeaderProps) {
	const getActiveFiltersText = () => {
		const activeFilters = []
		if (filters.budget) activeFilters.push(`Бюджет: ${filters.budget}`)
		if (filters.budget_item)
			activeFilters.push(`Стаття: ${filters.budget_item}`)
		if (filters.cfo) activeFilters.push(`ЦФО: ${filters.cfo}`)
		if (filters.org) activeFilters.push(`Організація: ${filters.org}`)
		if (filters.macro_item)
			activeFilters.push(`Макростаття: ${filters.macro_item}`)

		// Consolidated table specific filters
		if ('budget_object' in filters && filters.budget_object) {
			activeFilters.push(`Об'єкт: ${filters.budget_object}`)
		}
		if ('sort_by' in filters && filters.sort_by) {
			activeFilters.push(`Сортування: ${filters.sort_by}`)
		}
		if ('sort_order' in filters && filters.sort_order) {
			activeFilters.push(
				`Порядок: ${
					filters.sort_order === 'asc' ? 'за зростанням' : 'за спаданням'
				}`
			)
		}
		return activeFilters.join(', ')
	}

	return (
		<div className='flex gap-5 items-center'>
			<div className='flex-1'>
				<CardTitle>{title}</CardTitle>
				{hasActiveFilters && (
					<div className='flex items-center gap-2 mt-2'>
						<FilterIcon className='h-4 w-4 text-blue-600' />
						<span className='text-sm text-blue-600 font-medium'>
							Активні фільтри: {getActiveFiltersText()}
						</span>
					</div>
				)}
			</div>
			<div className='flex items-center gap-2'>
				{hasActiveFilters && (
					<Button
						variant='outline'
						size='sm'
						onClick={onClearFilters}
						className='h-8'
					>
						<X className='h-4 w-4 mr-1' />
						Очистити
					</Button>
				)}
				<Button
					variant='outline'
					size='sm'
					onClick={onToggleFilters}
					className='h-8'
				>
					<FilterIcon className='h-4 w-4 mr-1' />
					{isFiltersExpanded ? 'Сховати' : 'Показати'} фільтри
				</Button>
				{fileUrl && (
					<a
						href={fileUrl}
						download={`${downloadFileName}-${dateRange.startDate}-${
							dateRange.endDate
						}${hasActiveFilters ? '-filtered' : ''}.xlsx`}
					>
						<Button>
							<DownloadIcon /> Завантажити Excel файл
						</Button>
					</a>
				)}
			</div>
		</div>
	)
}
