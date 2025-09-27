import { api } from '@/lib/axios'
import { FilterOptions, PlanFactFilters } from '@/typing/filters'
import { ISummaryReport } from '@/typing/summary-report'

interface AnomalyData {
	[category: string]: string[] | object[] | any
}

class PlanFactService {
	async getPlanFact(budgetVersion?: number) {
		const params = new URLSearchParams()

		if (budgetVersion) {
			params.append('budget_version', budgetVersion.toString())
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

	async getMainTable(budgetVersion?: number, filters?: PlanFactFilters) {
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

	async getKeyIndicatorsFilters() {
		return (
			await api.get<{ indicator: string[] }>(
				'/plan-fact/filters/key-indicators'
			)
		).data
	}

	async getTopDeviations(
		budgetType: { key: string; label: string },
		budgetVersion?: number
	) {
		const params = new URLSearchParams({
			logistic_type: budgetType?.key,
		})

		if (budgetVersion) {
			params.append('budget_version', budgetVersion.toString())
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

	async getBudgetTypes() {
		const response = await api.get<{ key: string; label: string }[]>(
			'/plan-fact/budget-types'
		)
		return response.data
	}

	async getLogisticsTypes() {
		const response = await api.get<{ key: string; label: string }[]>(
			'/plan-fact/logistics-types'
		)
		return response.data
	}

	async getQuantityMetrics(budgetType: string) {
		const response = await api.get(
			`/plan-fact/quantity-metrics?type=${budgetType}`,
			{
				responseType: 'blob',
				headers: {
					Accept:
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				},
			}
		)
		return response.data
	}

	async getKeyIndicators(version_id: number, indicator: string) {
		const response = await api.get(
			`/plan-fact/key-indicators?budget_version=${version_id}&indicator=${indicator}`,
			{
				responseType: 'blob',
				headers: {
					Accept:
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				},
			}
		)
		return response.data
	}

	async getSummaryReport(budget_version?: number) {
		const params = new URLSearchParams()

		if (budget_version) {
			params.append('budget_version', budget_version.toString())
		}

		const response = await api.get<ISummaryReport>(
			`/plan-fact/summary-report?${params.toString()}`
		)

		return response.data
	}
}

export const planFactService = new PlanFactService()
