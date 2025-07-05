import { budgetingService } from '@/services/budgeting.service'
import { useQuery } from '@tanstack/react-query'

export function useSummaryData(
	startDate: string,
	endDate: string,
	enabled: boolean = true
) {
	return useQuery({
		queryKey: ['summary data', startDate, endDate],
		queryFn: () => budgetingService.getConsolidated(startDate, endDate),
		enabled,
	})
}
