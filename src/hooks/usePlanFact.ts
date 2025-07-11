import { planFactService } from '@/services/plan-fact.service'
import { Filters } from '@/typing/filters'
import { useQuery } from '@tanstack/react-query'

export function usePlanFactSummary(
	startDate: string,
	endDate: string,
	budgetVersion?: string
) {
	return useQuery({
		queryKey: ['plan-fact-summary', startDate, endDate, budgetVersion],
		queryFn: () =>
			planFactService.getPlanFact(startDate, endDate, budgetVersion),
		enabled: !!startDate && !!endDate,
		refetchOnWindowFocus: false,
	})
}

export function usePlanFactTable(
	startDate: string,
	endDate: string,
	budgetVersion?: string,
	filters?: Filters
) {
	return useQuery({
		queryKey: ['plan-fact-table', startDate, endDate, budgetVersion, filters],
		queryFn: () =>
			planFactService.getMainTable(startDate, endDate, budgetVersion, filters),
		enabled: !!startDate && !!endDate,
		refetchOnWindowFocus: false,
	})
}

export function useMainTableFilters() {
	return useQuery({
		queryKey: ['main-table-filters'],
		queryFn: () => planFactService.getMainTableFilters(),
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})
}

export function useTopDeviations(
	startDate: string,
	endDate: string,
	budgetVersion?: string
) {
	return useQuery({
		queryKey: ['top-deviations', startDate, endDate, budgetVersion],
		queryFn: () =>
			planFactService.getTopDeviations(startDate, endDate, budgetVersion),
		enabled: !!startDate && !!endDate,
		refetchOnWindowFocus: false,
	})
}
