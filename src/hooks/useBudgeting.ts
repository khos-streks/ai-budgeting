import { budgetingService } from '@/services/budgeting.service'
import { ConsolidatedFilters } from '@/typing/filters'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useSummaryData(
	startDate: string,
	endDate: string,
	budgetVersion?: string,
	filters?: ConsolidatedFilters
) {
	return useQuery({
		queryKey: ['summary data', startDate, endDate, budgetVersion, filters],
		queryFn: () =>
			budgetingService.getConsolidated(
				startDate,
				endDate,
				budgetVersion,
				filters
			),
		refetchOnWindowFocus: false,
	})
}

export function useBudgetVersions(
	startDate: string | undefined,
	endDate: string | undefined
) {
	return useQuery({
		queryKey: ['budget versions', startDate, endDate],
		queryFn: () => {
			if (!startDate || !endDate) return
			return budgetingService.getVersions(startDate, endDate)
		},
		refetchOnWindowFocus: false,
		enabled: !!startDate && !!endDate,
	})
}

export function useConsolidatedFilters() {
	return useQuery({
		queryKey: ['consolidated filters'],
		queryFn: () => budgetingService.getConsolidatedFilters(),
		refetchOnWindowFocus: false,
	})
}

export function useBudgetCounts() {
	return useQuery({
		queryKey: ['budget counts'],
		queryFn: () => budgetingService.getBudgetCounts(),
		refetchOnWindowFocus: false,
	})
}

export function useFiles() {
	return useQuery({
		queryKey: ['files'],
		queryFn: () => budgetingService.getFiles(),
		refetchOnWindowFocus: false,
	})
}

export function useDownloadFile(fileName: string | null) {
	return useQuery({
		queryKey: ['download file', fileName],
		queryFn: () => budgetingService.downloadFile(fileName),
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchInterval: false,
		enabled: !!fileName,
	})
}

export function useStartBudgeting() {
	return useMutation({
		mutationFn: async ({
			startDate,
			endDate,
		}: {
			startDate: string
			endDate: string
		}) => {
			return await budgetingService.start(startDate, endDate)
		},
	})
}

export function useGetBudgetingStatus() {
	return useQuery({
		queryKey: ['get budgeting status'],
		queryFn: async () => {
			return await budgetingService.getStatus()
		},
		refetchOnWindowFocus: false,
	})
}
