export interface ColumnMapping {
	key: string
	title: string
}

export interface DisplayColumn {
	index: number
	title: string
}

// Constants
export const COLUMN_MAPPINGS: ColumnMapping[] = [
	{ key: 'org', title: 'Організація' },
	{ key: 'budget', title: 'Бюджет' },
	{ key: 'cfo', title: 'ЦФО' },
	{ key: 'budget_object', title: "Об'єкт бюджетування" },
	{ key: 'budget_item', title: 'Статті бюджету' },
	{ key: 'macro_item', title: 'Макростатті' },
]

export const PAGE_SIZE = 50 // Number of rows per page
