'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CalendarIcon, DownloadIcon, Loader2 } from 'lucide-react'

interface ControlPanelProps {
	startDate: string
	endDate: string
	isLoading: boolean
	hasData: boolean
	onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onFetchData: () => void
	onDownloadExcel: () => void
}

export function ControlPanel({
	startDate,
	endDate,
	isLoading,
	hasData,
	onDateChange,
	onFetchData,
	onDownloadExcel,
}: ControlPanelProps) {
	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex flex-col gap-4'>
					<h2 className='text-xl font-bold'>Зведена таблиця бюджетування</h2>
					<p className='text-muted-foreground'>
						Оберіть дату для відображення зведеної таблиці бюджетування
					</p>

					<div className='flex flex-wrap items-end gap-4'>
						<div className='space-y-2'>
							<label htmlFor='dateStart' className='text-sm font-medium'>
								Дата початку
							</label>
							<Input
								id='dateStart'
								type='date'
								value={startDate}
								onChange={onDateChange}
								className='w-[200px]'
							/>
						</div>
						<div className='space-y-2'>
							<label htmlFor='dateEnd' className='text-sm font-medium'>
								Дата кінця
							</label>
							<Input
								id='dateEnd'
								type='date'
								value={endDate}
								onChange={onDateChange}
								className='w-[200px]'
							/>
						</div>

						<Button
							onClick={onFetchData}
							disabled={isLoading}
							className='gap-2'
						>
							{isLoading ? (
								<>
									<Loader2 className='h-4 w-4 animate-spin' />
									Завантаження...
								</>
							) : (
								<>
									<CalendarIcon className='h-4 w-4' />
									Показати дані
								</>
							)}
						</Button>

						{hasData && (
							<Button
								onClick={onDownloadExcel}
								variant='outline'
								className='gap-2'
							>
								<DownloadIcon className='h-4 w-4' />
								Зберегти Excel
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
