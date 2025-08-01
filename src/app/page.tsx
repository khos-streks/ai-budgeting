import { AiAssistant } from '@/components/dashboard/ai-assistant'
import { FilesDownloading } from '@/components/dashboard/files-downloading'
import { InfoPicker } from '@/components/dashboard/info-picker'
import { KeyIndicators } from '@/components/dashboard/key-indicators'
import { PlanFactSummary } from '@/components/dashboard/plan-fact/plan-fact-summary'
import { PlanFactTable } from '@/components/dashboard/plan-fact/plan-fact-table'
import { StartBudgeting } from '@/components/dashboard/start-budgeting'
import { SummaryTable } from '@/components/dashboard/summary-table'
import { TopDeviations } from '@/components/dashboard/top-deviations'
import { DateProvider } from '@/contexts/date-context'
import { SummaryReport } from '@/components/dashboard/summary-report'

export default function Home() {
	return (
		<>
			<main className='py-6 mx-auto grid grid-cols-[1fr_3fr] gap-6 max-xl:grid-cols-2 max-lg:grid-cols-1 max-w-full px-4'>
				<DateProvider>
					<div className='space-y-10 max-md:contents'>
						<InfoPicker />
						<FilesDownloading />
						<AiAssistant className='max-md:order-10 sticky top-10 h-[calc(100vh-5rem)]' />
					</div>
					<div className='w-full overflow-hidden space-y-10'>
						<PlanFactSummary />
						<StartBudgeting />
						<PlanFactTable />
						<SummaryTable />
						<KeyIndicators />
						<TopDeviations />
						<SummaryReport />
					</div>
				</DateProvider>
			</main>
		</>
	)
}
