'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface MonthYearPickerProps {
	id: string
	label?: string
	value: Date
	onChange: (date: Date) => void
	disabled?: boolean
}

export function DatePicker({
	id,
	label,
	value,
	onChange,
	disabled = false,
}: MonthYearPickerProps) {
	const [open, setOpen] = useState(false)
	const [tempYear, setTempYear] = useState(value.getFullYear())
	const [tempMonth, setTempMonth] = useState(value.getMonth())

	const months = [
		'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
		'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
	]

	const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 25 + i)

	return (
		<div className='flex flex-col gap-1 w-full'>
			{label && (
				<label htmlFor={id} className='text-sm font-medium'>
					{label}
				</label>
			)}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild disabled={disabled}>
					<div className='relative w-full'>
						<Input
							id={id}
							disabled={disabled}
							type='text'
							value={format(value, 'yyyy-MM')}
							readOnly
							className='pr-10 cursor-pointer'
						/>
						<CalendarIcon className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					</div>
				</PopoverTrigger>
				<PopoverContent
					className='p-3 rounded-xl shadow-lg border bg-white w-64'
					align='start'
					sideOffset={8}
				>
					<div className='flex flex-col gap-2'>
						<select
							value={tempYear}
							onChange={e => setTempYear(Number(e.target.value))}
							className='border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary'
						>
							{years.map(year => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>

						<div className='grid grid-cols-3 gap-2'>
							{months.map((month, index) => (
								<button
									key={month}
									type='button'
									onClick={() => {
										setTempMonth(index)
										onChange(new Date(tempYear, index, 1))
										setOpen(false)
									}}
									className={cn(
										'text-sm rounded-md px-2 py-1 transition-colors',
										index === tempMonth
											? 'bg-primary text-white'
											: 'hover:bg-muted'
									)}
								>
									{month.slice(0, 3)}
								</button>
							))}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
