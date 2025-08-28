'use client'

import { useDateContext } from '@/contexts/date-context'
import { useBudgetVersions } from '@/hooks/useBudgeting'
import {
	endOfMonth,
	endOfQuarter,
	endOfYear,
	format,
	isValid,
	parse,
	startOfMonth,
	startOfQuarter,
	startOfYear,
} from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { IBudgetVersion } from '@/typing/budget-version'

type DatePreset = 'month' | 'quarter' | 'year' | 'custom'

export function InfoPicker() {
	const { dateRange, setDateRange, setBudgetVersion } = useDateContext()
	const { data: budgetVersions } = useBudgetVersions(
		dateRange.startDate,
		dateRange.endDate
	)

	const [preset, setPreset] = useState<DatePreset>('custom')
	const [selectedBudgetVersion, setSelectedBudgetVersion] = useState<
		IBudgetVersion | undefined
	>(dateRange.budgetVersion || undefined)

	useEffect(() => {
		setSelectedBudgetVersion(budgetVersions?.[0])
		setBudgetVersion(budgetVersions?.[0])
	}, [budgetVersions])

	// UI state for calendar visibility
	const [showCalendar, setShowCalendar] = useState(false)
	const [calendarType, setCalendarType] = useState<'start' | 'end' | null>(null)

	// Local state for input values (pending changes)
	const [inputValues, setInputValues] = useState({
		start: dateRange.startDate,
		end: dateRange.endDate,
	})

	// State for parsed date objects
	const [dates, setDates] = useState({
		start: parseDate(dateRange.startDate),
		end: parseDate(dateRange.endDate),
	})

	function parseDate(dateString: string): Date | undefined {
		const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date())
		return isValid(parsedDate) ? parsedDate : undefined
	}

	// Apply date preset
	const applyDatePreset = (preset: DatePreset) => {
		setPreset(preset)

		// If custom is selected, we don't need to change the dates
		if (preset === 'custom') {
			return
		}

		const now = new Date()
		let startDate: Date
		let endDate: Date

		switch (preset) {
			case 'month':
				startDate = startOfMonth(now)
				endDate = endOfMonth(now)
				break
			case 'quarter':
				startDate = startOfQuarter(now)
				endDate = endOfQuarter(now)
				break
			case 'year':
				startDate = startOfYear(now)
				endDate = endOfYear(now)
				break
			default:
				return
		}

		const formattedStartDate = format(startDate, 'yyyy-MM-dd')
		const formattedEndDate = format(endDate, 'yyyy-MM-dd')

		setInputValues(prev => ({
			...prev,
			start: formattedStartDate,
			end: formattedEndDate,
		}))
		setDates(prev => ({
			...prev,
			start: startDate,
			end: endDate,
		}))
	}

	// Handle date selection from calendar
	const handleDaySelect = (day: Date, type: 'start' | 'end') => {
		const formattedDate = format(day, 'yyyy-MM-dd')

		// Update local state
		setDates(prev => ({ ...prev, [type]: day }))
		setInputValues(prev => ({ ...prev, [type]: formattedDate }))

		// Set preset to custom when manually selecting dates
		setPreset('custom')
	}

	// Apply date changes to context
	const applyDates = () => {
		setDateRange({
			startDate: inputValues.start,
			endDate: inputValues.end,
			budgetVersion: dateRange.budgetVersion,
		})
	}

	// Apply budget version to context
	const applyBudgetVersion = () => {
		setBudgetVersion(selectedBudgetVersion)
	}

	// Toggle calendar visibility
	const toggleCalendar = (type: 'start' | 'end') => {
		setShowCalendar(prev => !prev)
		setCalendarType(type)
	}

	// Helper to render a date input field with calendar
	const renderDateField = (type: 'start' | 'end', label: string) => {
		return (
			<div className='relative'>
				<Label htmlFor={type} className='mb-1 block'>
					{label}
				</Label>
				<div className='flex items-center'>
					<Input
						id={type}
						type='text'
						placeholder='YYYY-MM-DD'
						value={inputValues[type]}
						disabled
						className='pr-10 disabled:opacity-100'
					/>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						className='absolute right-0 h-full'
						onClick={() => toggleCalendar(type)}
					>
						<CalendarIcon className='h-4 w-4' />
					</Button>
				</div>
			</div>
		)
	}

	// Get date range summary text based on preset
	const getDateRangeSummary = () => {
		if (preset === 'custom') {
			return null // We'll show the date inputs instead
		}

		return (
			<p className='text-sm text-muted-foreground'>
				Період: {inputValues.start} — {inputValues.end}
			</p>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Вибір дат перегляду</CardTitle>
			</CardHeader>
			<CardContent className='space-y-6'>
				<div className='space-y-2'>
					<h3 className='text-lg font-medium'>Період</h3>
					<Tabs
						value={preset}
						onValueChange={value => applyDatePreset(value as DatePreset)}
						className='w-full'
					>
						<TabsList className='grid grid-cols-4 mb-4'>
							<TabsTrigger value='month'>Місяць</TabsTrigger>
							<TabsTrigger value='quarter'>Квартал</TabsTrigger>
							<TabsTrigger value='year'>Рік</TabsTrigger>
							<TabsTrigger value='custom'>Кастом</TabsTrigger>
						</TabsList>
					</Tabs>
					{preset === 'custom' ? (
						<div className='flex flex-col gap-4'>
							<div className='flex gap-4'>
								{renderDateField('start', 'Початкова дата')}
								{renderDateField('end', 'Кінцева дата')}
							</div>
							<Button onClick={applyDates} className='self-end'>
								Застосувати
							</Button>
						</div>
					) : (
						<div className='flex flex-col gap-2'>
							{getDateRangeSummary()}
							<Button onClick={applyDates} className='self-end'>
								Застосувати
							</Button>
						</div>
					)}
				</div>

				{/* Calendar popup */}
				{showCalendar && calendarType && (
					<Card className='absolute z-10 top-1/2 -translate-y-1/4 px-3'>
						{calendarType === 'start' ? (
							<>Вибір початкової дати</>
						) : (
							<>Вибір кінцевої дати</>
						)}
						<DayPicker
							mode='single'
							selected={dates.start}
							onDayClick={day => handleDaySelect(day, calendarType)}
							defaultMonth={dates.start}
							footer={
								<div className='flex justify-end p-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={() => setShowCalendar(false)}
									>
										Close
									</Button>
								</div>
							}
						/>
					</Card>
				)}

				<div className='space-y-2'>
					<h3 className='text-lg font-medium'>Вибір версії бюджету</h3>
					<div className='space-y-2 flex flex-col'>
						<Label htmlFor='budget-version'>Версія бюджету</Label>
						<Select
							value={selectedBudgetVersion?.id.toString()}
							onValueChange={id => {
								setSelectedBudgetVersion(
									budgetVersions?.find(version => version.id === Number(id))
								)
							}}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Оберіть версію бюджету' />
							</SelectTrigger>
							<SelectContent>
								{budgetVersions?.map((version: IBudgetVersion) => (
									<SelectItem key={version.id} value={version.toString()}>
										{version.version} ({version.date_from} - {version.date_to})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{budgetVersions?.length === 0 && (
							<p className='text-sm text-muted-foreground'>
								Немає доступних версій бюджету для обраного періоду
							</p>
						)}
						<Button onClick={applyBudgetVersion} className='self-end'>
							Застосувати
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
