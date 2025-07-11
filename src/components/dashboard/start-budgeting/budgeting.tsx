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
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'

export function StartBudgeting() {
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

	const handleSubmit = () => {
		const formattedDates = {
			start: format(dates.start, 'yyyy-MM-dd'),
			end: format(dates.end, 'yyyy-MM-dd'),
		}
		console.log('Starting budgeting process with dates:', formattedDates)
		// Add your budgeting logic here
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='max-sm:w-full max-sm:text-wrap max-[380px]:h-auto!'>Запустити процес бюджетування</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Запустити процес бюджетування</DialogTitle>

					<div className='space-y-4 mt-4'>
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
								className='w-full'
								disabled={dates.start > dates.end}
							>
								Запустити бюджетування
							</Button>
						</div>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
