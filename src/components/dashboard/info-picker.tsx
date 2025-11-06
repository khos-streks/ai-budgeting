'use client'

import { useEffect, useState } from 'react'
import {
	startOfMonth,
	endOfMonth,
	startOfQuarter,
	endOfQuarter,
	startOfYear,
	endOfYear,
	format,
	parse,
	isValid,
} from 'date-fns'
import { LoaderIcon, RotateCwIcon } from 'lucide-react'
import clsx from 'clsx'

import { useInfoContext } from '@/contexts/info-context'
import { useBudgetVersions, useDeleteBudgetVersion } from '@/hooks/useBudgeting'
import { useGetPlanFactStatus, useStartPlanFact } from '@/hooks/usePlanFact'
import { IBudgetVersion } from '@/typing/budget-version'

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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'

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
	const { data: budgetVersions } = useBudgetVersions()
	const { mutateAsync: deleteVersion, isPending } = useDeleteBudgetVersion()

	const [preset, setPreset] = useState<DatePreset>('custom')
	const [selectedBudgetVersion, setSelectedBudgetVersion] = useState<
		IBudgetVersion | undefined
	>(budgetVersion || undefined)
	const [dates, setDates] = useState<{ start?: Date; end?: Date }>({
		start: parseDate(startDate),
		end: parseDate(endDate),
	})
	const [timeLeft, setTimeLeft] = useState<number | null>(null)
	const [isPlanFactRunning, setIsPlanFactRunning] = useState(
		planFactStatus?.is_running
	)

	function parseDate(dateString: string): Date | undefined {
		const parsed = parse(dateString, 'yyyy-MM-dd', new Date())
		return isValid(parsed) ? parsed : undefined
	}

	useEffect(() => {
		if (budgetVersions?.length) {
			setSelectedBudgetVersion(budgetVersions[0])
			setBudgetVersion(budgetVersions[0])
		}
	}, [budgetVersions])

	useEffect(() => {
		const isBackendRunning = planFactStatus?.is_running
		const backendStatus = planFactStatus?.status?.toLowerCase()

		const isFinished =
			backendStatus?.includes('заверш') ||
			backendStatus?.includes('готов') ||
			backendStatus?.includes('done')

		if (isFinished) {
			setIsPlanFactRunning(false)
			setTimeLeft(null)
			return
		}

		if (isBackendRunning) {
			setIsPlanFactRunning(true)
			if (timeLeft === null) setTimeLeft(5 * 60)
		} else {
			setIsPlanFactRunning(false)
			setTimeLeft(null)
		}
	}, [planFactStatus])

	useEffect(() => {
		if (!isPlanFactRunning) return

		const statusInterval = setInterval(() => {
			refetch()
		}, 15000)

		const interval = setInterval(() => {
			setTimeLeft(prev => {
				if (prev === null) return null
				if (prev <= 1) {
					clearInterval(interval)
					refetch()
					setIsPlanFactRunning(false)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => {
			clearInterval(statusInterval)
			clearInterval(interval)
		}
	}, [isPlanFactRunning])

	const applyDatePreset = (preset: DatePreset) => {
		setPreset(preset)
		if (preset === 'custom') return

		const now = new Date()
		let start: Date
		let end: Date

		switch (preset) {
			case 'month':
				start = startOfMonth(now)
				end = endOfMonth(now)
				break
			case 'quarter':
				start = startOfQuarter(now)
				end = endOfQuarter(now)
				break
			case 'year':
				start = startOfYear(now)
				end = endOfYear(now)
				break
			default:
				return
		}

		setDates({ start, end })
		setStartDate(format(start, 'yyyy-MM-dd'))
		setEndDate(format(end, 'yyyy-MM-dd'))
	}

	const handleDaySelect = (day: Date, type: 'start' | 'end') => {
		setDates(prev => ({ ...prev, [type]: day }))
		setPreset('custom')
		type === 'start'
			? setStartDate(format(day, 'yyyy-MM-dd'))
			: setEndDate(format(day, 'yyyy-MM-dd'))
	}

	const applyDates = async () => {
		if (!dates.start || !dates.end) return
		try {
			await startPlanFact({
				startDate: format(dates.start, 'yyyy-MM-dd'),
				endDate: format(dates.end, 'yyyy-MM-dd'),
				budgetVersion: selectedBudgetVersion?.version ?? null,
			})
			setTimeLeft(5 * 60)
			setIsPlanFactRunning(true)
			refetch()
		} catch {}
	}

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return `${m}:${s.toString().padStart(2, '0')}`
	}

	const renderDateField = (type: 'start' | 'end', label: string) => (
		<DatePicker
			disabled={isPlanFactStartPending}
			id={`${type}-date`}
			label={label}
			value={dates[type] ?? new Date()}
			onChange={day => handleDaySelect(day, type)}
		/>
	)

	const renderPlanFactStatus = () => {
		const message = planFactStatus?.status ?? planFactStartData?.status
		if (!message && !isPlanFactRunning) return null

		return (
			<div className='flex flex-col gap-2 mt-2 text-gray-600'>
				<div className='flex items-center gap-2'>
					<span className='text-sm'>
						{isStatusLoading || isStatusRefetching ? (
							<div className='flex items-center gap-2'>
								<LoaderIcon className='animate-spin' size={20} />{' '}
								Завантаження...
							</div>
						) : (
							message
						)}
					</span>
					{isPlanFactRunning && timeLeft !== null && (
						<span className='text-sm text-muted-foreground'>
							⏳ Залишилось: ~{formatTime(timeLeft)}
						</span>
					)}
				</div>
			</div>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Вибір дат план-факт аналізу</CardTitle>
			</CardHeader>
			<CardContent className='space-y-6'>
				<Tabs
					value={preset}
					onValueChange={v => applyDatePreset(v as DatePreset)}
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
					<div className='flex gap-4'>
						{renderDateField('start', 'Початкова дата')}
						{renderDateField('end', 'Кінцева дата')}
					</div>
				) : (
					<p className='text-sm text-muted-foreground'>
						Період: {dates.start && format(dates.start, 'yyyy-MM-dd')} —{' '}
						{dates.end && format(dates.end, 'yyyy-MM-dd')}
					</p>
				)}

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
									const version = budgetVersions.find(v => v.id === Number(id))
									setSelectedBudgetVersion(version)
									setBudgetVersion(version)
								}}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Оберіть версію бюджету' />
								</SelectTrigger>
								<SelectContent>
									{budgetVersions.map(v => (
										<SelectItem key={v.id} value={v.id.toString()}>
											{v.version} ({v.date_from} - {v.date_to})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{budgetVersions.length === 0 && (
								<p className='text-sm text-muted-foreground'>
									Немає доступних версій бюджету для обраного періоду
								</p>
							)}
							<Dialog>
								<DialogTrigger>
									<Button
										disabled={
											isPending ||
											isPlanFactStartPending ||
											!selectedBudgetVersion ||
											isPlanFactRunning
										}
										variant='destructive'
										className='self-end flex items-center gap-2 bg-transparent border border-destructive text-destructive hover:text-white'
									>
										Видалити
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogTitle>
										Підтвердження видалення версії бюджету
									</DialogTitle>
									<p>
										Видалення версії бюджету є незворотнім. Ви впевнені, що
										хочете продовжити?
									</p>
									<Button
										disabled={
											isPending ||
											isPlanFactStartPending ||
											!selectedBudgetVersion ||
											isPlanFactRunning
										}
										onClick={async () => {
											if (!selectedBudgetVersion?.id) return
											await deleteVersion(selectedBudgetVersion.id.toString())
										}}
										className='flex items-center gap-2 w-min'
									>
										{isPending && <LoaderIcon className='animate-spin' />}
										Так
									</Button>
								</DialogContent>
							</Dialog>
						</div>
					) : (
						<>Завантаження версій бюджету...</>
					)}
				</div>

				<Dialog>
					<DialogTrigger>
						<Button
							disabled={
								isPlanFactStartPending ||
								isPlanFactRunning ||
								!selectedBudgetVersion ||
								!dates.start ||
								!dates.end ||
								(dates.start &&
									dates.end &&
									dates.end.getTime() < dates.start.getTime())
							}
							title={
								!selectedBudgetVersion || !dates.start || !dates.end
									? 'Оберіть період і версію бюджету'
									: dates.start &&
									  dates.end &&
									  dates.end.getTime() < dates.start.getTime()
									? 'Кінцева дата не може бути меншою за початкову'
									: ''
							}
							className='self-end flex items-center gap-2 disabled:pointer-events-auto'
						>
							Запустити аналіз
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogTitle>Підтвердження запуску аналізу</DialogTitle>
						<p>
							Ви впевнені, що хочете запустити план-факт аналіз для обраного
							періоду?
						</p>
						<Button
							onClick={applyDates}
							disabled={
								isPlanFactStartPending ||
								isPlanFactRunning ||
								!selectedBudgetVersion ||
								!dates.start ||
								!dates.end ||
								(dates.start &&
									dates.end &&
									dates.end.getTime() < dates.start.getTime())
							}
							title={
								!selectedBudgetVersion || !dates.start || !dates.end
									? 'Оберіть період і версію бюджету'
									: dates.start &&
									  dates.end &&
									  dates.end.getTime() < dates.start.getTime()
									? 'Кінцева дата не може бути меншою за початкову'
									: ''
							}
							className='flex items-center gap-2 disabled:pointer-events-auto w-min'
						>
							Так
						</Button>
					</DialogContent>
				</Dialog>

				{renderPlanFactStatus()}
			</CardContent>
		</Card>
	)
}
