import { api } from '@/lib/axios'

// Define interface for anomalies data structure
interface AnomalyData {
	[category: string]: string[] | object[] | any
}

class PlanFactService {
	async getPlanFact(startDate: string, endDate: string) {
		return (
			await api.get<{
				total_plan: number
				plan_change_percent: number
				execution_percent: number
				anomalies_count: number
				anomalies?: AnomalyData
			}>(`/plan-fact/summary?start_date=${startDate}&end_date=${endDate}`)
		).data
	}

	async getMainTable(startDate: string, endDate: string) {
		return (
			await api.get(
				`/plan-fact/main-table?start_date=${startDate}&end_date=${endDate}`,
				{
					responseType: 'blob',
					headers: {
						Accept:
							'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					},
				}
			)
		).data
	}

	async getTopDeviations(startDate: string, endDate: string) {
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
			}>(
				`/plan-fact/top-deviations?start_date=${startDate}&end_date=${endDate}`
			)
		).data
	}
}

export const planFactService = new PlanFactService()
