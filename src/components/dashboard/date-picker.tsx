'use client'

import { useDateContext } from '@/contexts/date-context'
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
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'

type DatePreset = 'month' | 'quarter' | 'year' | 'custom'
type DateFieldType =
	| 'budgetingStart'
	| 'budgetingEnd'
	| 'planFactStart'
	| 'planFactEnd'

export function DatePicker() {
	const {
		budgetingDateRange,
		planFactDateRange,
		setBudgetingDateRange,
		setPlanFactDateRange,
	} = useDateContext()

	const [budgetingPreset, setBudgetingPreset] = useState<DatePreset>('custom')
	const [planFactPreset, setPlanFactPreset] = useState<DatePreset>('custom')

	// UI state for calendar visibility
	const [showCalendars, setShowCalendars] = useState({
		budgetingStart: false,
		budgetingEnd: false,
		planFactStart: false,
		planFactEnd: false,
	})

	// Local state for input values (pending changes)
	const [inputValues, setInputValues] = useState({
		budgetingStart: budgetingDateRange.startDate,
		budgetingEnd: budgetingDateRange.endDate,
		planFactStart: planFactDateRange.startDate,
		planFactEnd: planFactDateRange.endDate,
	})

	// State for parsed date objects
	const [dates, setDates] = useState({
		budgetingStart: parseDate(budgetingDateRange.startDate),
		budgetingEnd: parseDate(budgetingDateRange.endDate),
		planFactStart: parseDate(planFactDateRange.startDate),
		planFactEnd: parseDate(planFactDateRange.endDate),
	})

	function parseDate(dateString: string): Date | undefined {
		const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date())
		return isValid(parsedDate) ? parsedDate : undefined
	}

	// Apply date preset
	const applyDatePreset = (
		preset: DatePreset,
		type: 'budgeting' | 'planFact'
	) => {
		// Update preset state regardless of which preset is selected
		if (type === 'budgeting') {
			setBudgetingPreset(preset)
		} else {
			setPlanFactPreset(preset)
		}

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

		if (type === 'budgeting') {
			setInputValues(prev => ({
				...prev,
				budgetingStart: formattedStartDate,
				budgetingEnd: formattedEndDate,
			}))
			setDates(prev => ({
				...prev,
				budgetingStart: startDate,
				budgetingEnd: endDate,
			}))
		} else {
			setInputValues(prev => ({
				...prev,
				planFactStart: formattedStartDate,
				planFactEnd: formattedEndDate,
			}))
			setDates(prev => ({
				...prev,
				planFactStart: startDate,
				planFactEnd: endDate,
			}))
		}
	}

	// Handle date selection from calendar
	const handleDaySelect = (day: Date, type: DateFieldType) => {
		const formattedDate = format(day, 'yyyy-MM-dd')

		// Update local state
		setDates(prev => ({ ...prev, [type]: day }))
		setInputValues(prev => ({ ...prev, [type]: formattedDate }))

		// Hide calendar
		setShowCalendars(prev => ({ ...prev, [type]: false }))

		// Set preset to custom when manually selecting dates
		if (type.startsWith('budgeting')) {
			setBudgetingPreset('custom')
		} else {
			setPlanFactPreset('custom')
		}
	}

	// Handle manual input changes
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: DateFieldType
	) => {
		const value = e.target.value

		// Update input value
		setInputValues(prev => ({ ...prev, [type]: value }))

		// Set preset to custom when manually editing dates
		if (type.startsWith('budgeting')) {
			setBudgetingPreset('custom')
		} else {
			setPlanFactPreset('custom')
		}

		// Parse and validate date
		const parsedDate = parseDate(value)
		if (parsedDate && isValid(parsedDate)) {
			setDates(prev => ({ ...prev, [type]: parsedDate }))
		}
	}

	// Apply date changes to context
	const applyBudgetingDates = () => {
		setBudgetingDateRange({
			startDate: inputValues.budgetingStart,
			endDate: inputValues.budgetingEnd,
		})
	}

	const applyPlanFactDates = () => {
		setPlanFactDateRange({
			startDate: inputValues.planFactStart,
			endDate: inputValues.planFactEnd,
		})
	}

	// Toggle calendar visibility
	const toggleCalendar = (type: DateFieldType) => {
		setShowCalendars(prev => ({
			...prev,
			[type]: !prev[type],
			// Close other calendars
			...(type !== 'budgetingStart' ? { budgetingStart: false } : {}),
			...(type !== 'budgetingEnd' ? { budgetingEnd: false } : {}),
			...(type !== 'planFactStart' ? { planFactStart: false } : {}),
			...(type !== 'planFactEnd' ? { planFactEnd: false } : {}),
		}))
	}

	// Helper to render a date input field with calendar
	const renderDateField = (type: DateFieldType, label: string) => {
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
						onChange={e => handleInputChange(e, type)}
						className='pr-10'
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

				{showCalendars[type] && (
					<Card className='absolute z-10 mt-1'>
						<DayPicker
							mode='single'
							selected={dates[type]}
							onDayClick={day => handleDaySelect(day, type)}
							defaultMonth={dates[type]}
							footer={
								<div className='flex justify-end p-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={() =>
											setShowCalendars(prev => ({ ...prev, [type]: false }))
										}
									>
										Close
									</Button>
								</div>
							}
						/>
					</Card>
				)}
			</div>
		)
	}

	// Helper to render preset tabs
	const renderPresetTabs = (type: 'budgeting' | 'planFact') => {
		const currentPreset =
			type === 'budgeting' ? budgetingPreset : planFactPreset

		return (
			<Tabs
				value={currentPreset}
				onValueChange={value => applyDatePreset(value as DatePreset, type)}
				className='w-full'
			>
				<TabsList className='grid grid-cols-4 mb-4'>
					<TabsTrigger value='month'>Місяць</TabsTrigger>
					<TabsTrigger value='quarter'>Квартал</TabsTrigger>
					<TabsTrigger value='year'>Рік</TabsTrigger>
					<TabsTrigger value='custom'>Кастом</TabsTrigger>
				</TabsList>
			</Tabs>
		)
	}

	// Get date range summary text based on preset
	const getDateRangeSummary = (type: 'budgeting' | 'planFact') => {
		const preset = type === 'budgeting' ? budgetingPreset : planFactPreset
		const startDate =
			type === 'budgeting'
				? inputValues.budgetingStart
				: inputValues.planFactStart
		const endDate =
			type === 'budgeting' ? inputValues.budgetingEnd : inputValues.planFactEnd

		if (preset === 'custom') {
			return null // We'll show the date inputs instead
		}

		return (
			<p className='text-sm text-muted-foreground'>
				Період: {startDate} — {endDate}
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
					<h3 className='text-lg font-medium'>Бюджетування</h3>
					{renderPresetTabs('budgeting')}
					{budgetingPreset === 'custom' ? (
						<div className='flex flex-col gap-4'>
							<div className='flex gap-4'>
								{renderDateField('budgetingStart', 'Початкова дата')}
								{renderDateField('budgetingEnd', 'Кінцева дата')}
							</div>
							<Button onClick={applyBudgetingDates} className='self-end'>
								Застосувати
							</Button>
						</div>
					) : (
						<div className='flex flex-col gap-2'>
							{getDateRangeSummary('budgeting')}
							<Button onClick={applyBudgetingDates} className='self-end'>
								Застосувати
							</Button>
						</div>
					)}
				</div>

				<div className='space-y-2'>
					<h3 className='text-lg font-medium'>План-факт аналіз</h3>
					{renderPresetTabs('planFact')}
					{planFactPreset === 'custom' ? (
						<div className='flex flex-col gap-4'>
							<div className='flex gap-4'>
								{renderDateField('planFactStart', 'Початкова дата')}
								{renderDateField('planFactEnd', 'Кінцева дата')}
							</div>
							<Button onClick={applyPlanFactDates} className='self-end'>
								Застосувати
							</Button>
						</div>
					) : (
						<div className='flex flex-col gap-2'>
							{getDateRangeSummary('planFact')}
							<Button onClick={applyPlanFactDates} className='self-end'>
								Застосувати
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
