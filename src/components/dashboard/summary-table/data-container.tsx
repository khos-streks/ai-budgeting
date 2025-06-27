'use client'

import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from './data-table'
import { TablePagination } from './table-pagination'
import { DisplayColumn } from './types'
import { formatDate } from './utils'

interface DataContainerProps {
	startDate: string
	endDate: string
	displayColumns: DisplayColumn[]
	currentPageData: any[][]
	startRow: number
	pagination: {
		currentPage: number
		maxPage: number
		startRow: number
		endRow: number
		totalRows: number
		hasMultiplePages: boolean
		actions: {
			nextPage: () => void
			prevPage: () => void
			firstPage: () => void
			lastPage: () => void
		}
	}
}

export function DataContainer({
	startDate,
	endDate,
	displayColumns,
	currentPageData,
	startRow,
	pagination,
}: DataContainerProps) {
	const formattedDate = formatDate(startDate)
	const formattedEndDate = formatDate(endDate)

	return (
		<Card>
			<CardContent className='pt-6'>
				<div className='flex justify-between items-center mb-4'>
					<div className='text-sm text-muted-foreground'>
						Дані станом на: {formattedDate} - {formattedEndDate}
					</div>

					{pagination.hasMultiplePages && (
						<TablePagination
							currentPage={pagination.currentPage}
							maxPage={pagination.maxPage}
							startRow={pagination.startRow}
							endRow={pagination.endRow}
							totalRows={pagination.totalRows}
							onFirstPage={pagination.actions.firstPage}
							onPrevPage={pagination.actions.prevPage}
							onNextPage={pagination.actions.nextPage}
							onLastPage={pagination.actions.lastPage}
						/>
					)}
				</div>

				<DataTable
					displayColumns={displayColumns}
					currentPageData={currentPageData}
					startRow={startRow}
				/>

				{/* Bottom pagination */}
				{pagination.hasMultiplePages && (
					<div className='flex justify-end mt-4'>
						<TablePagination
							currentPage={pagination.currentPage}
							maxPage={pagination.maxPage}
							startRow={pagination.startRow}
							endRow={pagination.endRow}
							totalRows={pagination.totalRows}
							onFirstPage={pagination.actions.firstPage}
							onPrevPage={pagination.actions.prevPage}
							onNextPage={pagination.actions.nextPage}
							onLastPage={pagination.actions.lastPage}
						/>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
