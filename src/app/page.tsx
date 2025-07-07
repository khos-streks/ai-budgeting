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
			<main className='py-6 mx-auto grid grid-cols-[1fr_3fr] gap-6 max-lg:grid-cols-2 max-md:grid-cols-1 max-w-full px-4'>
				<DateProvider>
					<div className='space-y-10 max-md:contents'>
						<DatePicker />
						<AiAssistant className='max-md:order-10 sticky top-10 h-[calc(100vh-5rem)]' />
					</div>
					<div className='w-full overflow-hidden space-y-10'>
						<PlanFactSummary />
						<PlanFactTable />
						<SummaryTable />
						<TopDeviations />
					</div>
				</DateProvider>
			</main>
		</>
	)
}
