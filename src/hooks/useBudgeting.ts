import { budgetingService } from '@/services/budgeting.service'
import { ConsolidatedFilters, Filters } from '@/typing/filters'
import { useQuery } from '@tanstack/react-query'

export function useSummaryData(
	startDate: string,
	endDate: string,
	budgetVersion?: string,
	filters?: ConsolidatedFilters,
) {
	return useQuery({
		queryKey: ['summary data', startDate, endDate, budgetVersion, filters],
		queryFn: () =>
			budgetingService.getConsolidated(startDate, endDate, budgetVersion, filters),
		refetchOnWindowFocus: false,
	})
}

export function useBudgetVersions(
	startDate: string,
	endDate: string,
) {
	return useQuery({
		queryKey: ['budget versions', startDate, endDate],
		queryFn: () => budgetingService.getVersions(startDate, endDate),
		refetchOnWindowFocus: false,
	})
}

export function useConsolidatedFilters() {
	return useQuery({
		queryKey: ['consolidated filters'],
		queryFn: () => budgetingService.getConsolidatedFilters(),
		refetchOnWindowFocus: false,
	})
}
