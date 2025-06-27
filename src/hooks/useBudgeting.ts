import { budgetingService } from '@/services/budgeting.service'
import { useQuery } from '@tanstack/react-query'

export function useBudgeting(
	startDate: string,
	endDate: string,
	enabled: boolean = true
) {
	return useQuery({
		queryKey: ['budgeting', startDate, endDate],
		queryFn: () => budgetingService.getConsolidated(startDate, endDate),
		enabled,
	})
}
