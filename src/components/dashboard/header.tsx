import { BarChart3 } from 'lucide-react'

export function DashboardHeader() {
	return (
		<header className='sticky top-0 z-10 border-b bg-background px-4 py-3 shadow-sm'>
			<div className='flex items-center'>
				<div className='flex items-center gap-2'>
					<BarChart3 className='h-6 w-6' />
					<h1 className='text-lg font-bold'>Бюджетування</h1>
				</div>
			</div>
		</header>
	)
}
