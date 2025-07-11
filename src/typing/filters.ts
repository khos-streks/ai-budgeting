export interface FilterOptions {
	budget: string[]
	budget_item: string[]
	cfo: string[]
	org: string[]
	macro_item: string[]
	budget_object?: string[]
}

export interface PlanFactFilters {
	budget?: string
	budget_item?: string
	cfo?: string
	org?: string
	macro_item?: string
}

// Extended filters for consolidated table (includes sorting and budget_object)
export interface ConsolidatedFilters extends PlanFactFilters {
	budget_object?: string
	sort_by?: string
	sort_order?: 'asc' | 'desc'
}

// Quick filter presets for different table types
export interface QuickFilterPreset {
	id: string
	label: string
	icon: string
	filters: Partial<PlanFactFilters | ConsolidatedFilters>
}

export const PLAN_FACT_QUICK_FILTERS: QuickFilterPreset[] = [
	{
		id: 'logistics',
		label: 'Логістика',
		icon: 'AlertTriangle',
		filters: {
			budget: 'Бюджет логістики',
		},
	},
	{
		id: 'production',
		label: 'Виробнича логістика',
		icon: 'TrendingUp',
		filters: {
			budget: 'Бюджет виробничої логістики',
		},
	},
	{
		id: 'warehouse',
		label: 'Оренда складів',
		icon: 'TrendingDown',
		filters: {
			budget: 'Бюджет оренди складів',
		},
	},
]

// Sort options for consolidated table
export const SORT_OPTIONS = [
	{ value: 'org', label: 'Організація' },
	{ value: 'amount', label: 'Сума' },
	{ value: 'budget', label: 'Бюджет' },
	{ value: 'deviation', label: 'Відхилення' },
] as const

export const SORT_ORDER_OPTIONS = [
	{ value: 'asc', label: 'За зростанням' },
	{ value: 'desc', label: 'За спаданням' },
] as const
