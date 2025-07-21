'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { DayPicker } from 'react-day-picker'
import { CalendarIcon, Loader2Icon, RotateCcw } from 'lucide-react'
import { useBudgetVersions } from '@/hooks/useBudgeting'
import { useGetPlanFactStatus, useStartPlanFact } from '@/hooks/usePlanFact'
import { IBudgetVersion } from '@/typing/budget-version'

export function StartPlanFact() {
	const { mutateAsync: start, isPending, isSuccess, data } = useStartPlanFact()

	const {
		data: status,
		isLoading: isStatusLoading,
		refetch: refetchStatus,
	} = useGetPlanFactStatus()

	const [dates, setDates] = useState({ start: new Date(), end: new Date() })
	const [showStartCalendar, setShowStartCalendar] = useState(false)
	const [showEndCalendar, setShowEndCalendar] = useState(false)

	const [currentBudgetVersion, setCurrentBudgetVersion] = useState<
		IBudgetVersion | undefined
	>(undefined)
	const [fetchVersions, setFetchVersions] = useState(false)

	const formattedDates = {
		startDate: format(dates.start, 'yyyy-MM-dd'),
		endDate: format(dates.end, 'yyyy-MM-dd'),
	}

	const { data: budgetVersions, isLoading: isVersionsLoading } =
		useBudgetVersions(
			fetchVersions ? formattedDates.startDate : undefined,
			fetchVersions ? formattedDates.endDate : undefined
		)

	useEffect(() => {
		if (dates.start && dates.end && dates.start <= dates.end) {
			setFetchVersions(true)
		}
	}, [dates.start, dates.end])

	const handleDaySelect = (day: Date, type: 'start' | 'end') => {
		setDates(prev => ({ ...prev, [type]: day }))
		if (type === 'start') setShowStartCalendar(false)
		else setShowEndCalendar(false)
	}

	const handleSubmit = async () => {
		try {
			if (dates.start > dates.end || isPending || !currentBudgetVersion) return
			await start({
				...formattedDates,
				budgetVersion: currentBudgetVersion.version,
			})
			await refetchStatus()
		} catch {}
	}

	const showStatusOnly = status?.is_running === true

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='max-sm:w-full max-sm:text-wrap max-[380px]:h-auto!'>
					Запустити процес план-факт аналізу
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Статус процесу план-факт аналізу</DialogTitle>
					<div className='space-y-4 mt-4'>
						{isStatusLoading ? (
							<div className='flex items-center gap-2 text-muted-foreground'>
								<Loader2Icon className='w-4 h-4 animate-spin' />
								<span>Завантаження...</span>
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
							<>
								<div className='space-y-2 p-4 rounded-md border bg-muted'>
									<p className='text-sm text-muted-foreground'>
										<b>Статус:</b> {data.status}
									</p>
									<p className='text-sm text-muted-foreground'>
										<b>Повідомлення:</b> {data.message}
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
						) : (
							<>
								{/* Start Date Picker */}
								<div className='relative'>
									<Label htmlFor='start-date' className='mb-2'>
										Дата початку
									</Label>
									<div className='flex items-center'>
										<Input
											id='start-date'
											type='text'
											value={formattedDates.startDate}
											readOnly
											className='pr-10'
										/>
										<Button
											variant='ghost'
											size='icon'
											className='absolute right-0 h-full'
											onClick={() => setShowStartCalendar(!showStartCalendar)}
										>
											<CalendarIcon className='w-4 h-4' />
										</Button>
									</div>
									{showStartCalendar && (
										<div className='absolute z-10 mt-1 bg-white border rounded-md shadow-lg'>
											<DayPicker
												mode='single'
												selected={dates.start}
												onDayClick={day => handleDaySelect(day, 'start')}
												defaultMonth={dates.start}
											/>
										</div>
									)}
								</div>

								{/* End Date Picker */}
								<div className='relative'>
									<Label htmlFor='end-date' className='mb-2'>
										Дата завершення
									</Label>
									<div className='flex items-center'>
										<Input
											id='end-date'
											type='text'
											value={formattedDates.endDate}
											readOnly
											className='pr-10'
										/>
										<Button
											variant='ghost'
											size='icon'
											className='absolute right-0 h-full'
											onClick={() => setShowEndCalendar(!showEndCalendar)}
										>
											<CalendarIcon className='w-4 h-4' />
										</Button>
									</div>
									{showEndCalendar && (
										<div className='absolute z-10 mt-1 bg-white border rounded-md shadow-lg'>
											<DayPicker
												mode='single'
												selected={dates.end}
												onDayClick={day => handleDaySelect(day, 'end')}
												defaultMonth={dates.end}
											/>
										</div>
									)}
								</div>

								{/* Budget Version Selector */}
								{isVersionsLoading ? (
									<p className='text-sm text-muted-foreground'>
										Завантаження версій бюджету...
									</p>
								) : budgetVersions && budgetVersions?.length > 0 ? (
									<div className='w-full'>
										<Label className='mb-2'>Версія бюджету</Label>
										<Select
											onValueChange={value =>
												setCurrentBudgetVersion(
													budgetVersions?.find(v => v.id.toString() === value)
												)
											}
											value={currentBudgetVersion?.id?.toString() || ''}
										>
											<SelectTrigger>
												<SelectValue placeholder='Оберіть версію бюджету' />
											</SelectTrigger>
											<SelectContent>
												{budgetVersions?.map((v: any) => (
													<SelectItem key={v.id} value={v.id.toString()}>
														{v.version} ({v.date_from} - {v.date_to})
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								) : fetchVersions ? (
									<p className='text-sm text-muted-foreground'>
										Немає доступних версій
									</p>
								) : null}

								{/* Submit Button */}
								<div className='pt-4'>
									<Button
										onClick={handleSubmit}
										className='w-full flex items-center gap-2'
										disabled={
											dates.start > dates.end ||
											isPending ||
											currentBudgetVersion === null
										}
									>
										{isPending && (
											<Loader2Icon className='w-4 h-4 animate-spin' />
										)}
										Запустити план-факт аналіз
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
