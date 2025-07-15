// Type definition for anomaly data
export interface AnomalyData {
	[category: string]: string[] | object[] | any
}

// Type definition for the summary data
export interface SummaryData {
	total_plan: number
	plan_change_percent: number
	execution_percent: number
	anomalies_count: number
	anomalies?: AnomalyData
}

// Helper functions for formatting and displaying data
export const getLabel = (key: string) => {
	switch (key) {
		case 'total_plan':
			return 'Загальний план'
		case 'plan_change_percent':
			return 'Відхилення від плану'
		case 'execution_percent':
			return 'Виконання'
		case 'anomalies_count':
			return 'Аномалії'
		case 'budget_counts':
			return 'Кількість бюджетів'
		default:
			return key
	}
}

export const formatValue = (key: string, value: any) => {
	if (key === 'total_plan') {
		return new Intl.NumberFormat('uk-UA', {
			style: 'currency',
			currency: 'UAH',
		}).format(Number(value))
	}
	if (key === 'plan_change_percent' || key === 'execution_percent') {
		return `${Number(value).toFixed(2)}%`
	}
	if (typeof value === 'object' && value !== null) {
		return JSON.stringify(value)
	}
	return value
}

export const getNumericValue = (value: any): number => {
	return value !== undefined && value !== '' ? Number(value) : 0
}
