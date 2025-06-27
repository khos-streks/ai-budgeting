import { useMemo, useState } from 'react'
import { PAGE_SIZE } from '../types'

export function usePagination(tableData: Array<Array<any>>) {
	// Pagination
	const [currentPage, setCurrentPage] = useState(0)

	// Calculate total rows
	const totalRows = useMemo(
		() => (tableData.length > 1 ? tableData.length - 1 : 0),
		[tableData.length]
	)

	// Calculate max page
	const maxPage = Math.ceil(totalRows / PAGE_SIZE) - 1

	// Calculate row range
	const startRow = currentPage * PAGE_SIZE + 1 // +1 because tableData[0] is header
	const endRow = Math.min((currentPage + 1) * PAGE_SIZE, totalRows) + 1

	// Get current page data
	const currentPageData = useMemo(() => {
		if (tableData.length <= 1) return []
		return tableData.slice(startRow, endRow + 1)
	}, [tableData, startRow, endRow])

	// Handle pagination actions
	const handleNextPage = () => {
		setCurrentPage(prev => Math.min(prev + 1, maxPage))
	}

	const handlePrevPage = () => {
		setCurrentPage(prev => Math.max(prev - 1, 0))
	}

	const handleFirstPage = () => {
		setCurrentPage(0)
	}

	const handleLastPage = () => {
		setCurrentPage(maxPage)
	}

	// Reset pagination
	const resetPagination = () => {
		setCurrentPage(0)
	}

	return {
		currentPage,
		maxPage,
		totalRows,
		startRow,
		endRow,
		currentPageData,
		hasMultiplePages: totalRows > PAGE_SIZE,
		actions: {
			nextPage: handleNextPage,
			prevPage: handlePrevPage,
			firstPage: handleFirstPage,
			lastPage: handleLastPage,
			reset: resetPagination,
		},
	}
}
