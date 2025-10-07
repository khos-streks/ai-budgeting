'use client'

import { IBudgetVersion } from '@/typing/budget-version'
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
import { LoaderIcon, RotateCwIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import 'react-day-picker/dist/style.css'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { DatePicker } from '../ui/date-picker'
import { Label } from '../ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { useBudgetVersions, useDeleteBudgetVersion } from '@/hooks/useBudgeting'
import { useGetPlanFactStatus, useStartPlanFact } from '@/hooks/usePlanFact'
import clsx from 'clsx'
import { useInfoContext } from '@/contexts/budget-version-context'

type DatePreset = 'month' | 'quarter' | 'year' | 'custom'

export function InfoPicker() {
	const {
		startDate,
		endDate,
		setStartDate,
		setEndDate,
		budgetVersion,
		setBudgetVersion,
	} = useInfoContext()
	const {
		mutateAsync: startPlanFact,
		isPending: isPlanFactStartPending,
		data: planFactStartData,
	} = useStartPlanFact()
	const {
		data: planFactStatus,
		refetch,
		isRefetching: isStatusRefetching,
		isLoading: isStatusLoading,
	} = useGetPlanFactStatus()
	const [dateRange, setDateRange] = useState<{
		startDate: string
		endDate: string
	}>({
		startDate,
		endDate,
	})
	const { data: budgetVersions } = useBudgetVersions()
	const { mutateAsync: deleteVersion, isPending } = useDeleteBudgetVersion()
	const [preset, setPreset] = useState<DatePreset>('custom')
	const [selectedBudgetVersion, setSelectedBudgetVersion] = useState<
		IBudgetVersion | undefined
	>(budgetVersion || undefined)
	const [inputValues, setInputValues] = useState({
		start: dateRange.startDate,
		end: dateRange.endDate,
	})
	const [dates, setDates] = useState({
		start: parseDate(dateRange.startDate),
		end: parseDate(dateRange.endDate),
	})

	function parseDate(dateString: string): Date | undefined {
		const parsedDate = parse(dateString, 'yyyy-MM', new Date())
		return isValid(parsedDate) ? parsedDate : undefined
	}

	useEffect(() => {
		setSelectedBudgetVersion(budgetVersions?.[0])
		setBudgetVersion(budgetVersions?.[0])
	}, [budgetVersions])

	const applyDatePreset = (preset: DatePreset) => {
		setPreset(preset)
		if (preset === 'custom') return
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
		const formattedStartDate = format(startDate, 'yyyy-MM')
		const formattedEndDate = format(endDate, 'yyyy-MM')
		setInputValues({ start: formattedStartDate, end: formattedEndDate })
		setDates({ start: startDate, end: endDate })
	}

	const handleDaySelect = (day: Date, type: 'start' | 'end') => {
		const formattedDate = format(day, 'yyyy-MM')
		setDates(prev => ({ ...prev, [type]: day }))
		setInputValues(prev => ({ ...prev, [type]: formattedDate }))
		type === 'start' ? setStartDate(formattedDate) : setEndDate(formattedDate)
		setPreset('custom')
	}

	const applyDates = async () => {
		setDateRange({ startDate: inputValues.start, endDate: inputValues.end })
		try {
			await startPlanFact({
				...dateRange,
				budgetVersion: budgetVersion?.version ?? null,
			})
			refetch()
		} catch {}
	}

	const applyBudgetVersion = () => setBudgetVersion(selectedBudgetVersion)

	const renderDateField = (
		type: 'start' | 'end',
		label: string,
		selectedDate: Date | undefined,
		disabled = false
	) => (
		<DatePicker
			disabled={disabled}
			id={`${type}-date`}
			label={label}
			onChange={day => handleDaySelect(day, type)}
			value={selectedDate ?? new Date()}
		/>
	)

	const getDateRangeSummary = () => {
		if (preset === 'custom') return null
		return (
			<p className='text-sm text-muted-foreground'>
				Період: {inputValues.start} — {inputValues.end}
			</p>
		)
	}

	const renderPlanFactStatus = () => {
		const startStatus = planFactStartData?.status

		const backendStatus = planFactStatus?.status
		const isRunning = planFactStatus?.is_running

		if (!startStatus && !backendStatus && !isRunning) return null

		let message = backendStatus ?? startStatus

		return (
			<div className={`flex items-center gap-2 mt-2 text-gray-600`}>
				<span className='text-sm'>{message}</span>

				<Button
					onClick={() => refetch()}
					disabled={
						isPlanFactStartPending || isStatusRefetching || isStatusRefetching
					}
					variant='outline'
					size='sm'
					className='self-start flex items-center gap-2'
				>
					<RotateCwIcon
						className={clsx('w-4 h-4 transition-transform duration-500', {
							'rotate-[360deg]': isStatusLoading || isStatusRefetching,
						})}
					/>
					Оновити статус
				</Button>
			</div>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Вибір дат план-факт аналізу</CardTitle>
			</CardHeader>
			<CardContent className='space-y-10'>
				<div className='space-y-2'>
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
								{renderDateField(
									'start',
									'Початкова дата',
									dates.start,
									isPlanFactStartPending
								)}
								{renderDateField(
									'end',
									'Кінцева дата',
									dates.end,
									isPlanFactStartPending
								)}
							</div>
						</div>
					) : (
						<div className='flex flex-col gap-2'>{getDateRangeSummary()}</div>
					)}
				</div>

				<div className='space-y-2'>
					<h3 className='text-base font-semibold'>
						Керування версіями бюджету
					</h3>
					{budgetVersions ? (
						<div className='space-y-2 flex flex-col'>
							<Label htmlFor='budget-version'>Версія бюджету</Label>
							<Select
								disabled={isPlanFactStartPending}
								value={selectedBudgetVersion?.id.toString() ?? ''}
								onValueChange={id => {
									setSelectedBudgetVersion(
										budgetVersions.find(version => version.id === Number(id))
									)
									applyBudgetVersion()
								}}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Оберіть версію бюджету' />
								</SelectTrigger>
								<SelectContent>
									{budgetVersions.map((version: IBudgetVersion) => (
										<SelectItem key={version.id} value={version.id.toString()}>
											{version.version} ({version.date_from} - {version.date_to}
											)
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{budgetVersions?.length === 0 && (
								<p className='text-sm text-muted-foreground'>
									Немає доступних версій бюджету для обраного періоду
								</p>
							)}
							<div className='flex items-center gap-2'>
								<Button
									disabled={
										isPending ||
										isPlanFactStartPending ||
										!selectedBudgetVersion
									}
									onClick={async () => {
										try {
											if (!selectedBudgetVersion?.id) return
											await deleteVersion(selectedBudgetVersion.id.toString())
										} catch {}
									}}
									variant='destructive'
									className='self-end flex items-center gap-2 bg-transparent border border-destructive text-destructive hover:text-white'
								>
									{isPending && <LoaderIcon className='animate-spin' />}
									Видалити
								</Button>
							</div>
						</div>
					) : (
						<>Завантаження версій бюджету...</>
					)}
				</div>

				<Button
					onClick={applyDates}
					disabled={
						isPlanFactStartPending ||
						!selectedBudgetVersion ||
						!dates.start ||
						!dates.end ||
						(dates.start &&
							dates.end &&
							new Date(`${dates.end}-01`).getTime() <
								new Date(`${dates.start}-01`).getTime())
					}
					title={
						!selectedBudgetVersion || !dates.start || !dates.end
							? 'Оберіть період і версію бюджету'
							: dates.start &&
							  dates.end &&
							  new Date(`${dates.end}-01`).getTime() <
									new Date(`${dates.start}-01`).getTime()
							? 'Кінцева дата не може бути меншою за початкову'
							: ''
					}
					className='self-end flex items-center gap-2 disabled:pointer-events-auto'
				>
					Запустити аналіз
				</Button>

				{renderPlanFactStatus()}
			</CardContent>
		</Card>
	)
}
