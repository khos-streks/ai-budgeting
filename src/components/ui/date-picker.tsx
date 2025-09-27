'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface DatePickerProps {
	id: string
	label?: string
	value: Date
	onChange: (date: Date) => void
}

export function DatePicker({ id, label, value, onChange }: DatePickerProps) {
	const [open, setOpen] = useState(false)

	return (
		<div className='flex flex-col gap-1 w-full'>
			{label && (
				<label htmlFor={id} className='text-sm font-medium'>
					{label}
				</label>
			)}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div className='relative w-full'>
						<Input
							id={id}
							type='text'
							value={format(value, 'yyyy-MM-dd')}
							readOnly
							className='pr-10 cursor-pointer'
						/>
						<CalendarIcon className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					</div>
				</PopoverTrigger>
				<PopoverContent
					className='p-2 rounded-xl shadow-lg border bg-white w-auto pointer-events-auto'
					align='start'
					sideOffset={8}
				>
					<DayPicker
						mode='single'
						selected={value}
						onDayClick={day => {
							if (day) {
								onChange(day)
								setOpen(false)
							}
						}}
						defaultMonth={value}
						className='text-sm'
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
