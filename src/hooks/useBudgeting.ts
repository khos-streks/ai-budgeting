import { budgetingService } from '@/services/budgeting.service'
import { ConsolidatedFilters } from '@/typing/filters'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useSummaryData(
	budgetVersion?: number,
	filters?: ConsolidatedFilters
) {
	return useQuery({
		queryKey: ['summary data', budgetVersion, filters],
		queryFn: () => budgetingService.getConsolidated(budgetVersion, filters),
		refetchOnWindowFocus: false,
		enabled: !!budgetVersion,
	})
}

export function useBudgetVersions() {
	return useQuery({
		queryKey: ['budget versions'],
		queryFn: budgetingService.getVersions,
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

export function useBudgetCounts() {
	return useQuery({
		queryKey: ['budget counts'],
		queryFn: () => budgetingService.getBudgetCounts(),
		refetchOnWindowFocus: false,
	})
}

export function useDeleteBudgetVersion() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (id: string) => {
			return await budgetingService.deleteVersion(id)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['budget versions'] })
		},
	})
}

export function useFiles({ budgetVersion }: { budgetVersion?: number }) {
	return useQuery({
		queryKey: ['files', budgetVersion],
		queryFn: () => budgetingService.getFiles(budgetVersion),
		refetchOnWindowFocus: false,
	})
}

export function useDownloadFile({
	fileName,
	budgetVersion,
}: {
	fileName: string | null
	budgetVersion?: number
}) {
	return useQuery({
		queryKey: ['download file', fileName, budgetVersion],
		queryFn: () => budgetingService.downloadFile({ fileName, budgetVersion }),
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
