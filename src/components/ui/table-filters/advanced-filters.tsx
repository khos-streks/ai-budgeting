'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	ConsolidatedFilters,
	FilterOptions,
	PlanFactFilters,
	SORT_OPTIONS,
	SORT_ORDER_OPTIONS,
} from '@/typing/filters'

interface AdvancedFiltersProps {
	filters: PlanFactFilters | ConsolidatedFilters
	filterOptions: FilterOptions | undefined
	isLoading: boolean
	onFilterChange: (key: string, value: string) => void
	showSorting?: boolean
	showBudgetObject?: boolean
}

export function AdvancedFilters({
	filters,
	filterOptions,
	isLoading,
	onFilterChange,
	showSorting = false,
	showBudgetObject = false,
}: AdvancedFiltersProps) {
	if (isLoading) {
		return (
			<div className='text-center py-4'>
				<span className='text-muted-foreground'>Завантаження фільтрів...</span>
			</div>
		)
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
			{/* Budget Filter */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Бюджет</label>
				<Select
					value={filters.budget || 'all'}
					onValueChange={value => onFilterChange('budget', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Виберіть бюджет' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Всі бюджети</SelectItem>
						{filterOptions?.budget
							?.filter(i => !!i.length)
							.map(budget => (
								<SelectItem key={budget} value={budget}>
									{budget}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>

			{/* Budget Item Filter */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Стаття бюджету</label>
				<Select
					value={filters.budget_item || 'all'}
					onValueChange={value => onFilterChange('budget_item', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Виберіть статтю' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Всі статті</SelectItem>
						{filterOptions?.budget_item
							?.filter(i => !!i.length)
							?.map(item => (
								<SelectItem key={item} value={item}>
									{item}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>

			{/* Budget Object Filter - only for consolidated table */}
			{showBudgetObject && (
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Об'єкт бюджету</label>
					<Select
						value={(filters as ConsolidatedFilters).budget_object || 'all'}
						onValueChange={value => onFilterChange('budget_object', value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Виберіть об'єкт" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Всі об'єкти</SelectItem>
							{filterOptions?.budget_object
								?.filter(i => !!i.length)
								?.map(object => (
									<SelectItem key={object} value={object}>
										{object}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>
			)}

			{/* CFO Filter */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>ЦФО</label>
				<Select
					value={filters.cfo || 'all'}
					onValueChange={value => onFilterChange('cfo', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Виберіть ЦФО' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Всі ЦФО</SelectItem>
						{filterOptions?.cfo
							?.filter(i => !!i.length)
							?.map(cfo => (
								<SelectItem key={cfo} value={cfo}>
									{cfo}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>

			{/* Organization Filter */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Організація</label>
				<Select
					value={filters.org || 'all'}
					onValueChange={value => onFilterChange('org', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Виберіть організацію' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Всі організації</SelectItem>
						{filterOptions?.org
							?.filter(i => !!i.length)
							?.map(org => (
								<SelectItem key={org} value={org}>
									{org}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>

			{/* Macro Item Filter */}
			<div className='space-y-2'>
				<label className='text-sm font-medium'>Макростаття</label>
				<Select
					value={filters.macro_item || 'all'}
					onValueChange={value => onFilterChange('macro_item', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Виберіть макростаттю' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Всі макростатті</SelectItem>
						{filterOptions?.macro_item
							?.filter(i => !!i.length)
							?.map(macroItem => (
								<SelectItem key={macroItem} value={macroItem}>
									{macroItem}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</div>

			{/* Sort By Filter - only for consolidated table */}
			{showSorting && (
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Сортування за</label>
					<Select
						value={(filters as ConsolidatedFilters).sort_by || 'org'}
						onValueChange={value => onFilterChange('sort_by', value)}
					>
						<SelectTrigger>
							<SelectValue placeholder='Виберіть поле для сортування' />
						</SelectTrigger>
						<SelectContent>
							{SORT_OPTIONS?.filter(i => !!i.value).map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Sort Order Filter - only for consolidated table */}
			{showSorting && (
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Порядок сортування</label>
					<Select
						value={(filters as ConsolidatedFilters).sort_order || 'desc'}
						onValueChange={value => onFilterChange('sort_order', value)}
					>
						<SelectTrigger>
							<SelectValue placeholder='Виберіть порядок' />
						</SelectTrigger>
						<SelectContent>
							{SORT_ORDER_OPTIONS?.filter(i => !!i.value).map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		</div>
	)
}
