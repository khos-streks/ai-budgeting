'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetBudgetingStatus, useStartBudgeting } from '@/hooks/useBudgeting'
import { format } from 'date-fns'
import { CalendarIcon, Loader2Icon, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'

export function StartBudgeting() {
	const { mutateAsync: start, isPending, isSuccess, data } = useStartBudgeting()

	const {
		data: status,
		isLoading: isStatusLoading,
		refetch: refetchStatus,
	} = useGetBudgetingStatus()

	const [dates, setDates] = useState({ start: new Date(), end: new Date() })
	const [showStartCalendar, setShowStartCalendar] = useState(false)
	const [showEndCalendar, setShowEndCalendar] = useState(false)

	const handleDaySelect = (day: Date, type: 'start' | 'end') => {
		setDates(prev => ({ ...prev, [type]: day }))
		if (type === 'start') {
			setShowStartCalendar(false)
		} else {
			setShowEndCalendar(false)
		}
	}

	const handleSubmit = async () => {
		const formattedDates = {
			startDate: format(dates.start, 'yyyy-MM-dd'),
			endDate: format(dates.end, 'yyyy-MM-dd'),
		}
		try {
			await start(formattedDates)
			await refetchStatus()
		} catch {}
	}

	const showStatusOnly = status?.is_running === true

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='max-sm:w-full max-sm:text-wrap max-[380px]:h-auto!'>
					Запустити процес бюджетування
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Статус процесу бюджетування</DialogTitle>
					<div className='space-y-4 mt-4'>
						{isStatusLoading ? (
							<div className='flex items-center gap-2 text-muted-foreground'>
								<Loader2Icon className='w-4 h-4 animate-spin' />
								<span>Завантаження статусу...</span>
							</div>
						) : showStatusOnly ? (
							<>
								<div className='space-y-2 p-4 rounded-md border bg-muted'>
									<p className='text-sm text-muted-foreground'>
										<b>Статус:</b> {status.status}
									</p>
								</div>
								<div className='pt-2'>
									<Button
										variant='outline'
										className='w-full flex items-center gap-2'
										onClick={() => refetchStatus()}
									>
										<RotateCcw className='w-4 h-4' />
										Оновити дані
									</Button>
								</div>
							</>
						) : isSuccess && data ? (
							<div className='space-y-2 p-4 rounded-md border bg-muted'>
								<p className='text-sm text-muted-foreground'>
									<b>Статус:</b> {data.status}
								</p>
								<p className='text-sm text-muted-foreground'>
									<b>Повідомлення:</b> {data.message}
								</p>
							</div>
						) : (
							<>
								{/* Start Date Picker */}
								<div className='relative'>
									<Label htmlFor='start-date' className='mb-1 block'>
										Дата початку
									</Label>
									<div className='flex items-center'>
										<Input
											id='start-date'
											type='text'
											placeholder='YYYY-MM-DD'
											value={format(dates.start, 'yyyy-MM-dd')}
											className='pr-10'
											readOnly
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='absolute right-0 h-full'
											onClick={() => setShowStartCalendar(!showStartCalendar)}
										>
											<CalendarIcon className='h-4 w-4' />
										</Button>
									</div>
									{showStartCalendar && (
										<div className='absolute z-10 mt-1 bg-white border rounded-md shadow-lg'>
											<DayPicker
												mode='single'
												selected={dates.start}
												onDayClick={day => handleDaySelect(day, 'start')}
												defaultMonth={dates.start}
												footer={
													<div className='flex justify-end p-2'>
														<Button
															variant='outline'
															size='sm'
															onClick={() => setShowStartCalendar(false)}
														>
															Закрити
														</Button>
													</div>
												}
											/>
										</div>
									)}
								</div>

								{/* End Date Picker */}
								<div className='relative'>
									<Label htmlFor='end-date' className='mb-1 block'>
										Дата завершення
									</Label>
									<div className='flex items-center'>
										<Input
											id='end-date'
											type='text'
											placeholder='YYYY-MM-DD'
											value={format(dates.end, 'yyyy-MM-dd')}
											className='pr-10'
											readOnly
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='absolute right-0 h-full'
											onClick={() => setShowEndCalendar(!showEndCalendar)}
										>
											<CalendarIcon className='h-4 w-4' />
										</Button>
									</div>
									{showEndCalendar && (
										<div className='absolute z-10 mt-1 bg-white border rounded-md shadow-lg'>
											<DayPicker
												mode='single'
												selected={dates.end}
												onDayClick={day => handleDaySelect(day, 'end')}
												defaultMonth={dates.end}
												footer={
													<div className='flex justify-end p-2'>
														<Button
															variant='outline'
															size='sm'
															onClick={() => setShowEndCalendar(false)}
														>
															Закрити
														</Button>
													</div>
												}
											/>
										</div>
									)}
								</div>

								{/* Submit Button */}
								<div className='pt-4'>
									<Button
										onClick={handleSubmit}
										className='w-full flex items-center gap-2'
										disabled={dates.start > dates.end || isPending}
									>
										{isPending && (
											<Loader2Icon className='w-4 h-4 animate-spin' />
										)}
										Запустити бюджетування
									</Button>
								</div>
							</>
						)}
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
