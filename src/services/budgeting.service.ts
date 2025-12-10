import { api } from '@/lib/axios'
import { IBudgetVersion } from '@/typing/budget-version'
import { ConsolidatedFilters } from '@/typing/filters'

class BudgetingService {
	async getConsolidated(budgetVersion?: number, filters?: ConsolidatedFilters) {
		const params = new URLSearchParams()

		if (budgetVersion) {
			params.append('budget_version', budgetVersion.toString())
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
			await api.get(`/budgeting/consolidated?${params.toString()}`, {
				responseType: 'blob',
				headers: {
					Accept:
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				},
			})
		).data
	}

	async getVersions() {
		const response = await api.get<IBudgetVersion[]>(
			`/budgeting/budget-versions`
		)
		return response.data
	}

	async deleteVersion(id: string) {
		const response = await api.delete(`/budgeting/budget-versions/${id}`)
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

	async getFiles(budgetVersion?: number) {
		const response = await api.get<{ files: string[] }>(
			`/budgeting/file-names`,
			{ params: { version: budgetVersion } }
		)
		return response.data
	}

	async downloadFile({
		fileName,
		budgetVersion,
	}: {
		fileName: string | null
		budgetVersion?: number
	}) {
		if (!fileName) return
		const response = await api.get(`/budgeting/download/${fileName}`, {
			params: { version: budgetVersion },
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
