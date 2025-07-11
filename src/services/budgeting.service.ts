import { api } from '@/lib/axios'
import { ConsolidatedFilters } from '@/typing/filters'

class BudgetingService {
	async getConsolidated(
		startDate: string,
		endDate: string,
		budgetVersion?: string,
		filters?: ConsolidatedFilters
	) {
		const params = new URLSearchParams({
			start_date: startDate,
			end_date: endDate,
		})

		if (budgetVersion) {
			params.append('budget_version', budgetVersion)
		}

		// Add filter parameters
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value) {
					params.append(key, value)
				}
			})
		}

		return (
			await api.get(`/plan-fact/main-table?${params.toString()}`, {
				responseType: 'blob',
				headers: {
					Accept:
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				},
			})
		).data
	}

	async getVersions(startDate: string, endDate: string) {
		const response = await api.get(
			`/budgeting/budget-versions?date_from=${startDate}&date_to=${endDate}`
		)
		return response.data
	}

	async getConsolidatedFilters() {
		const response = await api.get(`/budgeting/filters/consolidated`)
		return response.data
	}
}

export const budgetingService = new BudgetingService()
