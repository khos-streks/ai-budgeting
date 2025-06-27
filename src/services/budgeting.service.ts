import { api } from '@/lib/axios'

class BudgetingService {
	async getConsolidated(startDate: string, endDate: string) {
		const response = await api.get(
			`/budgeting/consolidated?startDate=${startDate}&endDate=${endDate}`,
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
}

export const budgetingService = new BudgetingService()
