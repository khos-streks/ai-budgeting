import { planFactService } from '@/services/plan-fact.service'
import { PlanFactFilters } from '@/typing/filters'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function usePlanFactSummary(budgetVersion?: number) {
	return useQuery({
		queryKey: ['plan-fact-summary', budgetVersion],
		queryFn: () => planFactService.getPlanFact(budgetVersion),
		refetchOnWindowFocus: false,
		enabled: !!budgetVersion
	})
}

export function usePlanFactTable(
	budgetVersion?: number,
	filters?: PlanFactFilters
) {
	return useQuery({
		queryKey: ['plan-fact-table', budgetVersion, filters],
		queryFn: () => planFactService.getMainTable(budgetVersion, filters),
		refetchOnWindowFocus: false,
		enabled: !!budgetVersion
	})
}

export function useMainTableFilters() {
	return useQuery({
		queryKey: ['main-table-filters'],
		queryFn: () => planFactService.getMainTableFilters(),
		refetchOnWindowFocus: false,
	})
}

export function useKeyIndicatorsFilters() {
	return useQuery({
		queryKey: ['key-indicators-filters'],
		queryFn: () => planFactService.getKeyIndicatorsFilters(),
		refetchOnWindowFocus: false,
	})
}

export function useTopDeviations(
	budgetType: { key: string; label: string } | undefined,
	budgetVersion?: number
) {
	return useQuery({
		queryKey: ['top-deviations', budgetType, budgetVersion],
		queryFn: () => {
			if (!budgetType) return
			return planFactService.getTopDeviations(budgetType, budgetVersion)
		},
		enabled: !!budgetType && !!budgetVersion,
		refetchOnWindowFocus: false,
	})
}

export function useStartPlanFact() {
	const queryClient = useQueryClient()
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
		onSuccess: () =>{
			queryClient.invalidateQueries({queryKey: ['get plan-fact status']})
		}
	})
}

export function useGetPlanFactStatus() {
	return useQuery({
		queryKey: ['get plan-fact status'],
		queryFn: planFactService.getStatus,
		refetchOnWindowFocus: false,
	})
}

export function useGetBudgetTypes() {
	return useQuery({
		queryKey: ['get budget types'],
		queryFn: planFactService.getBudgetTypes,
		refetchOnWindowFocus: false,
	})
}

export function useGetLogisticsTypes() {
	return useQuery({
		queryKey: ['get logistics types'],
		queryFn: planFactService.getLogisticsTypes,
		refetchOnWindowFocus: false,
	})
}

export function useGetQuantityMetrics(budgetType: string | undefined) {
	return useQuery({
		queryKey: ['get quantity metrics', budgetType],
		queryFn: () => {
			if (budgetType) {
				return planFactService.getQuantityMetrics(budgetType)
			}
		},
		refetchOnWindowFocus: false,
		enabled: !!budgetType,
	})
}

export function useGetKeyIndicators(
	version_id: number | undefined,
	indicator: string | undefined
) {
	return useQuery({
		queryKey: ['get key indicators', version_id, indicator],
		queryFn: () => {
			if (version_id && indicator) {
				return planFactService.getKeyIndicators(version_id, indicator)
			}
		},
		refetchOnWindowFocus: false,
		enabled: !!version_id && !!indicator,
	})
}

export function useGetSummaryReport(budgetVersion?: number) {
	return useQuery({
		queryKey: ['get summary report', budgetVersion],
		queryFn: () => {
			if (budgetVersion) {
				return planFactService.getSummaryReport(budgetVersion)
			}
		},
		refetchOnWindowFocus: false,
		enabled: !!budgetVersion,
	})
}
