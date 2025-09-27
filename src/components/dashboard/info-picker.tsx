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
import { LoaderIcon } from 'lucide-react'
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
import { useBudgetVersionContext } from '@/contexts/budget-version-context'
import { useBudgetVersions, useDeleteBudgetVersion } from '@/hooks/useBudgeting'
import { useGetPlanFactStatus, useStartPlanFact } from '@/hooks/usePlanFact'

type DatePreset = 'month' | 'quarter' | 'year' | 'custom'

export function InfoPicker() {
	const { budgetVersion, setBudgetVersion } = useBudgetVersionContext()

	const { mutateAsync: startPlanFact, isPending: isPlanFactStartPending } =
		useStartPlanFact()
	const {
		data: planFactStatus,
		refetch,
		isLoading: isStatusLoading,
		isRefetching: isStatusRefetching,
	} = useGetPlanFactStatus()

	const [dateRange, setDateRange] = useState<{
		startDate: string
		endDate: string
	}>({
		startDate: `${new Date().getFullYear()}-01-01`,
		endDate: `${new Date().getFullYear()}-12-31`,
	})
	const { data: budgetVersions } = useBudgetVersions()
	const { mutateAsync: deleteVersion, isPending } = useDeleteBudgetVersion()

	const [preset, setPreset] = useState<DatePreset>('custom')
	const [selectedBudgetVersion, setSelectedBudgetVersion] = useState<
		IBudgetVersion | undefined
	>(budgetVersion || undefined)

	useEffect(() => {
		setSelectedBudgetVersion(budgetVersions?.[0])
		setBudgetVersion(budgetVersions?.[0])
	}, [budgetVersions])

	const [inputValues, setInputValues] = useState({
		start: dateRange.startDate,
		end: dateRange.endDate,
	})

	const [dates, setDates] = useState({
		start: parseDate(dateRange.startDate),
		end: parseDate(dateRange.endDate),
	})

	function parseDate(dateString: string): Date | undefined {
		const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date())
		return isValid(parsedDate) ? parsedDate : undefined
	}

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
		const formattedStartDate = format(startDate, 'yyyy-MM-dd')
		const formattedEndDate = format(endDate, 'yyyy-MM-dd')
		setInputValues({ start: formattedStartDate, end: formattedEndDate })
		setDates({ start: startDate, end: endDate })
	}

	const handleDaySelect = (day: Date, type: 'start' | 'end') => {
		const formattedDate = format(day, 'yyyy-MM-dd')
		setDates(prev => ({ ...prev, [type]: day }))
		setInputValues(prev => ({ ...prev, [type]: formattedDate }))
		setPreset('custom')
	}

	const applyDates = async () => {
		setDateRange({
			startDate: inputValues.start,
			endDate: inputValues.end,
		})

		try {
			await startPlanFact({
				...dateRange,
				budgetVersion: budgetVersion?.version ?? null,
			})
		} catch {}
	}

	const applyBudgetVersion = () => {
		setBudgetVersion(selectedBudgetVersion)
	}

	const renderDateField = (
		type: 'start' | 'end',
		label: string,
		selectedDate: Date | undefined
	) => {
		return (
			<DatePicker
				id={`${type}-date`}
				label={label}
				onChange={day => handleDaySelect(day, type)}
				value={selectedDate ?? new Date()}
			/>
		)
	}

	const getDateRangeSummary = () => {
		if (preset === 'custom') return null
		return (
			<p className='text-sm text-muted-foreground'>
				Період: {inputValues.start} — {inputValues.end}
			</p>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Вибір дат план-факт аналізу</CardTitle>
			</CardHeader>
			<CardContent className='space-y-10'>
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
								{renderDateField('start', 'Початкова дата', dates.start)}
								{renderDateField('end', 'Кінцева дата', dates.end)}
							</div>
						</div>
					) : (
						<div className='flex flex-col gap-2'>{getDateRangeSummary()}</div>
					)}
					<Button
						onClick={applyDates}
						disabled={isPlanFactStartPending}
						className='self-end flex items-center gap-2'
					>
						{isPlanFactStartPending ? <LoaderIcon /> : 'Переглянути'}
					</Button>
					<div className='text-sm text-neutral-500'>
						Статус план-факт аналізу:{' '}
						<b>
							{isStatusLoading || isStatusRefetching
								? '...'
								: planFactStatus?.status}
						</b>
					</div>
				</div>

				<div className='space-y-2'>
					<h3 className='text-base font-semibold'>
						Керування версіями бюджету
					</h3>
					{budgetVersions ? (
						<div className='space-y-2 flex flex-col'>
							<Label htmlFor='budget-version'>Версія бюджету</Label>
							<Select
								value={selectedBudgetVersion?.id.toString() ?? ''}
								onValueChange={id => {
									setSelectedBudgetVersion(
										budgetVersions.find(version => version.id === Number(id))
									)
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
									disabled={isPending}
									onClick={async () => {
										try {
											if (!selectedBudgetVersion?.id) return
											await deleteVersion(selectedBudgetVersion.id.toString())
										} catch {}
									}}
									variant='destructive'
									className='self-end flex items-center gap-2'
								>
									{isPending && <LoaderIcon className='animate-spin' />}
									Видалити
								</Button>
								<Button
									disabled={isPending}
									onClick={applyBudgetVersion}
									className='self-end'
								>
									Переглянути
								</Button>
							</div>
						</div>
					) : (
						<>Завантаження версій бюджету...</>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
