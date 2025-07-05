import { useQuery } from '@tanstack/react-query'
import { planFactService } from '@/services/plan-fact.service'

export function usePlanFactSummary(startDate: string, endDate: string) {
	return useQuery({
		queryKey: ['plan-fact-summary', startDate, endDate],
		queryFn: () => planFactService.getPlanFact(startDate, endDate),
		enabled: !!startDate && !!endDate,
	})
}

export function usePlanFactTable(startDate: string, endDate: string) {
	return useQuery({
		queryKey: ['plan-fact-table', startDate, endDate],
		queryFn: () => planFactService.getMainTable(startDate, endDate),
		enabled: !!startDate && !!endDate,
	})
}

export function useTopDeviations(startDate: string, endDate: string) {
	return useQuery({
		queryKey: ['top-deviations', startDate, endDate],
		queryFn: () => planFactService.getTopDeviations(startDate, endDate),
		enabled: !!startDate && !!endDate,
	})
}
