import { api } from '@/lib/axios'
import { FilterOptions, PlanFactFilters } from '@/typing/filters'

interface AnomalyData {
	[category: string]: string[] | object[] | any
}

class PlanFactService {
	async getPlanFact(
		startDate: string,
		endDate: string,
		budgetVersion?: string
	) {
		const params = new URLSearchParams({
			start_date: startDate,
			end_date: endDate,
		})

		if (budgetVersion) {
			params.append('budget_version', budgetVersion)
		}

		return (
			await api.get<{
				total_plan: number
				plan_change_percent: number
				execution_percent: number
				anomalies_count: number
				anomalies?: AnomalyData
			}>(`/plan-fact/summary?${params.toString()}`)
		).data
	}

	async getMainTable(
		startDate: string,
		endDate: string,
		budgetVersion?: string,
		filters?: PlanFactFilters
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

	async getMainTableFilters() {
		return (await api.get<FilterOptions>('/plan-fact/filters/main-table')).data
	}

	async getTopDeviations(
		startDate: string,
		endDate: string,
		budgetVersion?: string
	) {
		const params = new URLSearchParams({
			start_date: startDate,
			end_date: endDate,
		})

		if (budgetVersion) {
			params.append('budget_version', budgetVersion)
		}

		return (
			await api.get<{
				negative: {
					budget_item: string
					deviation_amount: number
					deviation_percent: number
				}[]
				positive: {
					budget_item: string
					deviation_amount: number
					deviation_percent: number
				}[]
			}>(`/plan-fact/top-deviations?${params.toString()}`)
		).data
	}

	async start(
		start_date: string,
		end_date: string,
		budget_version: number | null
	) {
		const response = await api.post<{ status: string; message?: string }>(
			`/plan-fact/start`,
			{
				start_date,
				end_date,
				budget_version,
			}
		)
		return response.data
	}

	async getStatus() {
		const response = await api.get<{ is_running: boolean; status: string }>(
			`/plan-fact/status`
		)
		return response.data
	}
}

export const planFactService = new PlanFactService()
