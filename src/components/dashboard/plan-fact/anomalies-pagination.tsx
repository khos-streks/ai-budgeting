import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function AnomaliesPagination({
	currentPage,
	totalPages,
	handlePageChange,
}: {
	currentPage: number
	totalPages: number
	handlePageChange: (page: number) => void
}) {
	return (
		<div className='flex items-center justify-between mt-4'>
			<div className='text-sm text-muted-foreground'>
				Сторінка {currentPage} з {totalPages}
			</div>
			<div className='flex gap-1'>
				<Button
					variant='outline'
					size='icon'
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<ChevronLeft className='h-4 w-4' />
				</Button>
				{totalPages <= 5 ? (
					// Show all pages if 5 or fewer
					[...Array(totalPages)].map((_, i) => (
						<Button
							key={i}
							variant={currentPage === i + 1 ? 'default' : 'outline'}
							size='icon'
							onClick={() => handlePageChange(i + 1)}
						>
							{i + 1}
						</Button>
					))
				) : (
					// Show pagination with ellipsis for many pages
					<>
						<Button
							variant={currentPage === 1 ? 'default' : 'outline'}
							size='icon'
							onClick={() => handlePageChange(1)}
						>
							1
						</Button>

						{currentPage > 3 && <span className='px-2'>...</span>}

						{currentPage > 2 && (
							<Button
								variant='outline'
								size='icon'
								onClick={() => handlePageChange(currentPage - 1)}
							>
								{currentPage - 1}
							</Button>
						)}

						{currentPage !== 1 && currentPage !== totalPages && (
							<Button variant='default' size='icon'>
								{currentPage}
							</Button>
						)}

						{currentPage < totalPages - 1 && (
							<Button
								variant='outline'
								size='icon'
								onClick={() => handlePageChange(currentPage + 1)}
							>
								{currentPage + 1}
							</Button>
						)}

						{currentPage < totalPages - 2 && <span className='px-2'>...</span>}

						<Button
							variant={currentPage === totalPages ? 'default' : 'outline'}
							size='icon'
							onClick={() => handlePageChange(totalPages)}
						>
							{totalPages}
						</Button>
					</>
				)}
				<Button
					variant='outline'
					size='icon'
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<ChevronRight className='h-4 w-4' />
				</Button>
			</div>
		</div>
	)
}
