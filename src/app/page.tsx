import { DashboardHeader } from '@/components/dashboard'
import { BudgetSummaryTable } from '@/components/dashboard/summary-table'

export default function Home() {
	return (
		<>
			<DashboardHeader />
			<main className='container py-6 mx-auto'>
				<BudgetSummaryTable />
			</main>
		</>
	)
}
