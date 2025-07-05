import { AiAssistant } from '@/components/dashboard/ai-assistant'
import { DatePicker } from '@/components/dashboard/date-picker'
import { PlanFactSummary } from '@/components/dashboard/plan-fact/plan-fact-summary'
import { PlanFactTable } from '@/components/dashboard/plan-fact/plan-fact-table'
import { SummaryTable } from '@/components/dashboard/summary-table'
import { TopDeviations } from '@/components/dashboard/top-deviations'
import { DateProvider } from '@/contexts/date-context'

export default function Home() {
	return (
		<>
			<main className='py-6 mx-auto grid grid-cols-[3fr_1fr] gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 max-w-full px-4'>
				<DateProvider>
					<div className='w-full overflow-hidden space-y-10'>
						<DatePicker />
						<PlanFactSummary />
						<PlanFactTable />
						<SummaryTable />
						<TopDeviations />
					</div>
					<AiAssistant />
				</DateProvider>
			</main>
		</>
	)
}
