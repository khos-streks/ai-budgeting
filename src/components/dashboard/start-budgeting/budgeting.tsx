'use client'

import {  useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { DatePicker } from '@/components/ui/date-picker'
import { LoaderIcon, RotateCwIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGetBudgetingStatus, useStartBudgeting } from '@/hooks/useBudgeting'

export function StartBudgeting() {
	const { mutateAsync: startBudgeting, isPending, data: startData } = useStartBudgeting()
	const {
		data: budgetingStatus,
		isLoading: isStatusLoading,
		isRefetching,
		refetch,
	} = useGetBudgetingStatus()

	const [dates, setDates] = useState({ start: new Date(), end: new Date() })
	const [isRunning, setIsRunning] = useState<boolean | undefined>(false)

	const handleDaySelect = (day: Date, type: 'start' | 'end') => {
		setDates(prev => ({ ...prev, [type]: day }))
	}

	const handleSubmit = async () => {
		try {
			await startBudgeting({
				startDate: format(dates.start, 'yyyy-MM-dd'),
				endDate: format(dates.end, 'yyyy-MM-dd'),
			})
			setIsRunning(true)
			await refetch()
		} catch {}
	}

	const loading = isPending || isStatusLoading || isRefetching

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='max-sm:w-full'>Запустити</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md space-y-6'>
				<DialogHeader>
					<DialogTitle>Бюджетування</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<DatePicker
							id='start-date'
							label='Дата початку'
							value={dates.start}
							onChange={day => handleDaySelect(day, 'start')}
							disabled={isRunning || loading}
						/>
						<DatePicker
							id='end-date'
							label='Дата завершення'
							value={dates.end}
							onChange={day => handleDaySelect(day, 'end')}
							disabled={isRunning || loading}
						/>
					</div>

					<Button
						onClick={handleSubmit}
						className='w-full flex items-center gap-2'
						disabled={
							isRunning ||
							loading ||
							dates.start > dates.end
						}
					>
						{isPending && <LoaderIcon className='w-4 h-4 animate-spin' />}
						Запустити бюджетування
					</Button>
				</div>

				<div className='border-t pt-4 space-y-3'>
					<p className='text-sm text-muted-foreground'>
						<b>Статус:</b>{' '}
						{isStatusLoading || isRefetching ? (
							<span className='inline-flex items-center gap-2'>
								<LoaderIcon className='w-4 h-4 animate-spin' /> Завантаження...
							</span>
						) : (
							budgetingStatus?.status ?? startData?.status ?? 'Немає даних'
						)}
					</p>

					<Button
						onClick={() => refetch()}
						disabled={loading}
						variant='outline'
						size='sm'
						className='flex items-center gap-2 w-full'
					>
						<RotateCwIcon
							className={cn('w-4 h-4 transition-transform duration-500', {
								'rotate-[360deg]': loading,
							})}
						/>
						Оновити статус
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
