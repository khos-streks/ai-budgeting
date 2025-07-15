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

	async getBudgetCounts() {
		const response = await api.get<{ count: number }>(`/budgeting/count`)
		return response.data
	}

	async getFiles() {
		const response = await api.get<{ files: string[] }>(`/budgeting/file-names`)
		return response.data
	}

	async downloadFile(fileName: string | null) {
		if (!fileName) return
		const response = await api.get(`/budgeting/download/${fileName}`, {
			responseType: 'blob',
		})
		return response.data
	}

	async start(start_date: string, end_date: string) {
		const response = await api.post<{ status: string; message?: string }>(
			`/budgeting/start`,
			{
				start_date,
				end_date,
			}
		)
		return response.data
	}

	async getStatus() {
		const response = await api.get<{ is_running: boolean; status: string }>(
			`/budgeting/status`
		)
		return response.data
	}
}

export const budgetingService = new BudgetingService()
