import { planFactService } from '@/services/plan-fact.service'
import { PlanFactFilters } from '@/typing/filters'
import { useMutation, useQuery } from '@tanstack/react-query'

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
	filters?: PlanFactFilters
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

export function useStartPlanFact() {
	return useMutation({
		mutationFn: async ({
			startDate,
			endDate,
			budgetVersion,
		}: {
			startDate: string
			endDate: string
			budgetVersion: number | null
		}) => {
			return await planFactService.start(startDate, endDate, budgetVersion)
		},
	})
}

export function useGetPlanFactStatus() {
	return useQuery({
		queryKey: ['get plan-fact status'],
		queryFn: async () => {
			return await planFactService.getStatus()
		},
		refetchOnWindowFocus: false,
	})
}
