'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TablePaginationProps {
	currentPage: number
	maxPage: number
	startRow: number
	endRow: number
	totalRows: number
	onFirstPage: () => void
	onPrevPage: () => void
	onNextPage: () => void
	onLastPage: () => void
}

export function TablePagination({
	currentPage,
	maxPage,
	startRow,
	endRow,
	totalRows,
	onFirstPage,
	onPrevPage,
	onNextPage,
	onLastPage,
}: TablePaginationProps) {
	return (
		<div className='flex items-center gap-2 text-sm'>
			<span>
				Рядки {startRow} - {endRow} з {totalRows}
			</span>
			<div className='flex gap-1'>
				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={onFirstPage}
					disabled={currentPage === 0}
				>
					<ChevronLeft className='h-4 w-4' />
					<ChevronLeft className='h-4 w-4 -ml-3' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={onPrevPage}
					disabled={currentPage === 0}
				>
					<ChevronLeft className='h-4 w-4' />
				</Button>
				<span className='px-2 flex items-center'>
					{currentPage + 1} / {maxPage + 1}
				</span>
				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={onNextPage}
					disabled={currentPage >= maxPage}
				>
					<ChevronRight className='h-4 w-4' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className='h-8 w-8'
					onClick={onLastPage}
					disabled={currentPage >= maxPage}
				>
					<ChevronRight className='h-4 w-4' />
					<ChevronRight className='h-4 w-4 -ml-3' />
				</Button>
			</div>
		</div>
	)
}
