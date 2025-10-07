import { AiAssistant } from '@/components/dashboard/ai-assistant'
import { FilesDownloading } from '@/components/dashboard/files-downloading'
import { InfoPicker } from '@/components/dashboard/info-picker'
import { KeyIndicators } from '@/components/dashboard/key-indicators'
import { PlanFactSummary } from '@/components/dashboard/plan-fact/plan-fact-summary'
import { PlanFactTable } from '@/components/dashboard/plan-fact/plan-fact-table'
import { StartBudgeting } from '@/components/dashboard/start-budgeting'
import { SummaryReport } from '@/components/dashboard/summary-report'
import { SummaryTable } from '@/components/dashboard/summary-table'
import { TopDeviations } from '@/components/dashboard/top-deviations'
import { InfoContextProvider } from '@/contexts/info-context'

export default function Home() {
	return (
		<>
			<main className='py-6 mx-auto grid grid-cols-[1fr_3fr] gap-6 max-xl:grid-cols-2 max-lg:grid-cols-1 max-w-full px-4'>
				<InfoContextProvider>
					<div className='space-y-10 max-md:contents'>
						<InfoPicker />
						<StartBudgeting />
						<AiAssistant />
						<FilesDownloading />
					</div>
					<div className='w-full overflow-hidden space-y-10'>
						<PlanFactSummary />
						<TopDeviations />
						<SummaryReport />
						<KeyIndicators />
						<PlanFactTable />
						<SummaryTable />
					</div>
				</InfoContextProvider>
			</main>
		</>
	)
}
