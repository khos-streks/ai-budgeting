'use client'

import { useState, useEffect } from 'react'
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
	const {
		mutateAsync: startBudgeting,
		isPending,
		data: startData,
	} = useStartBudgeting()
	const {
		data: budgetingStatus,
		isLoading: isStatusLoading,
		isRefetching,
		refetch,
	} = useGetBudgetingStatus()

	const [dates, setDates] = useState({ start: new Date(), end: new Date() })
	const [isRunning, setIsRunning] = useState<boolean>(false)
	const [timeLeft, setTimeLeft] = useState<number | null>(null)

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
			setTimeLeft(10 * 60)
			await refetch()
		} catch {}
	}

	useEffect(() => {
		const isBackendRunning = budgetingStatus?.is_running
		const backendStatus = budgetingStatus?.status?.toLowerCase()

		const isFinished =
			backendStatus?.includes('заверш') ||
			backendStatus?.includes('готов') ||
			backendStatus?.includes('done')

		if (isFinished) {
			setIsRunning(false)
			setTimeLeft(null)
			return
		}

		if (isBackendRunning) {
			setIsRunning(true)
			if (timeLeft === null) setTimeLeft(10 * 60)
		} else {
			setIsRunning(false)
			setTimeLeft(null)
		}
	}, [budgetingStatus])

	useEffect(() => {
		if (!isRunning) return
		const statusInterval = setInterval(() => {
			refetch()
		}, 15000)
		const interval = setInterval(() => {
			setTimeLeft(prev => {
				if (prev === null) return null
				if (prev <= 1) {
					clearInterval(interval)
					refetch()
					setIsRunning(false)
					return 0
				}
				return prev - 1
			})
		}, 1000)
		return () => {
			clearInterval(statusInterval)
			clearInterval(interval)
		}
	}, [isRunning])

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return `${m}:${s.toString().padStart(2, '0')}`
	}

	const loading = isPending || isStatusLoading || isRefetching
	const message = budgetingStatus?.status ?? startData?.status ?? 'Немає даних'

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
						disabled={isRunning || loading || dates.start > dates.end}
					>
						{isPending && <LoaderIcon className='w-4 h-4 animate-spin' />}
						Запустити бюджетування
					</Button>

					{isRunning && timeLeft !== null && (
						<p className='text-sm text-muted-foreground'>
							⏳ Залишилось: ~{formatTime(timeLeft)}
						</p>
					)}
				</div>

				<div className='border-t pt-4 space-y-3'>
					<p className='text-sm text-muted-foreground'>
						<b>Статус:</b>{' '}
						{loading ? (
							<span className='inline-flex items-center gap-2'>
								<LoaderIcon className='w-4 h-4 animate-spin' /> Завантаження...
							</span>
						) : (
							message
						)}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
