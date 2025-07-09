'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import { AnomaliesPagination } from './anomalies-pagination'
import { AnomalyData, getNumericValue } from './summary-utils'

interface AnomaliesDialogProps {
	anomalies: AnomalyData | null | undefined
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	anomaliesCount: number
}

export function AnomaliesDialog({
	anomalies,
	isOpen,
	onOpenChange,
	anomaliesCount,
}: AnomaliesDialogProps) {
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)
	const [anomalyEntries, setAnomalyEntries] = useState<[string, any][]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [animationKey, setAnimationKey] = useState(0)

	useEffect(() => {
		if (anomalies && typeof anomalies === 'object') {
			const entries = Object.entries(anomalies)
			setAnomalyEntries(entries)
			setTotalPages(Math.max(1, Math.ceil(entries.length / itemsPerPage)))
		} else {
			setAnomalyEntries([])
			setTotalPages(1)
		}
		setCurrentPage(1)
	}, [anomalies, itemsPerPage, isOpen])

	const getCurrentPageItems = () => {
		const indexOfLastItem = currentPage * itemsPerPage
		const indexOfFirstItem = indexOfLastItem - itemsPerPage
		return anomalyEntries.slice(indexOfFirstItem, indexOfLastItem)
	}

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setAnimationKey(prev => prev + 1)
			setCurrentPage(newPage)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<div
					className={`text-2xl font-bold cursor-pointer ${
						getNumericValue(anomaliesCount) > 0 ? 'text-amber-600' : ''
					}`}
				>
					{anomaliesCount !== undefined ? anomaliesCount : 'Н/Д'}
				</div>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[600px] overflow-y-auto max-h-[80vh]'>
				<DialogHeader>
					<DialogTitle>Детальна інформація про аномалії</DialogTitle>
				</DialogHeader>
				<div className='mt-4'>
					{anomalies ? (
						<div className='space-y-4'>
							<div>
								<h4 className='font-medium mb-2'>Розбивка по типам аномалій</h4>
								{totalPages > 1 && (
									<AnomaliesPagination
										currentPage={currentPage}
										totalPages={totalPages}
										handlePageChange={handlePageChange}
									/>
								)}
								<div
									key={`page-${animationKey}`}
									className='grid grid-cols-1 mt-4 gap-2 transition-opacity duration-300 animate-in fade-in'
								>
									{anomalyEntries.length > 0 ? (
										getCurrentPageItems().map(([category, items]) => (
											<div key={category} className='border rounded p-3'>
												{Array.isArray(items) ? (
													<ul className='list-disc pl-5 mt-2'>
														{items.slice(0, 10).map((item, index) => (
															<li key={index} className='text-sm'>
																{typeof item === 'object' && item !== null ? (
																	<div className='w-full overflow-x-auto'>
																		<Table className='mt-1 w-full'>
																			<TableBody>
																				{Object.entries(item).map(
																					([key, value]) => (
																						<TableRow key={key}>
																							<TableCell className='font-medium'>
																								{key}
																							</TableCell>
																							<TableCell className='break-words'>
																								{typeof value === 'object' &&
																								value !== null
																									? JSON.stringify(value)
																									: String(value)}
																							</TableCell>
																						</TableRow>
																					)
																				)}
																			</TableBody>
																		</Table>
																	</div>
																) : (
																	item
																)}
															</li>
														))}
														{Array.isArray(items) && items.length > 10 && (
															<li className='text-sm text-muted-foreground mt-2'>
																...та ще {items.length - 10} елементів
															</li>
														)}
													</ul>
												) : (
													<div className='text-sm mt-1'>
														{typeof items === 'object' && items !== null ? (
															<div className='w-full overflow-x-auto'>
																<Table className='mt-1 w-full'>
																	<TableBody>
																		{Object.entries(items).map(
																			([key, value]) => (
																				<TableRow key={key}>
																					<TableCell className='font-medium'>
																						{key}
																					</TableCell>
																					<TableCell className='break-words'>
																						{typeof value === 'object' &&
																						value !== null
																							? JSON.stringify(value)
																							: String(value)}
																					</TableCell>
																				</TableRow>
																			)
																		)}
																	</TableBody>
																</Table>
															</div>
														) : (
															items
														)}
													</div>
												)}
											</div>
										))
									) : (
										<div className='text-center text-muted-foreground py-4'>
											Немає додаткової інформації про аномалії
										</div>
									)}
								</div>

								{totalPages > 1 && (
									<AnomaliesPagination
										currentPage={currentPage}
										totalPages={totalPages}
										handlePageChange={handlePageChange}
									/>
								)}
							</div>
						</div>
					) : (
						<p className='text-center text-muted-foreground py-4'>
							Немає додаткової інформації про аномалії
						</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
