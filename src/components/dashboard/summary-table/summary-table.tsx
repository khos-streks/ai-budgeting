'use client'

import { useState } from 'react'
import { ControlPanel } from './control-panel'
import { DataContainer } from './data-container'
import { ErrorDisplay } from './error-display'
import { usePagination } from './hooks/use-pagination'
import { useTableData } from './hooks/use-table-data'

export function BudgetSummaryTable() {
	// Date state
	const [startDate, setStartDate] = useState<string>(
		new Date().toISOString().split('T')[0]
	)
	const [endDate, setEndDate] = useState<string>(
		new Date().toISOString().split('T')[0]
	)

	// Table data hook
	const {
		tableData,
		displayColumns,
		isLoading,
		error,
		hasData,
		fetchData,
		downloadExcel,
	} = useTableData(startDate, endDate)

	// Pagination hook
	const pagination = usePagination(tableData)

	// Event handlers
	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.id === 'dateStart') {
			setStartDate(e.target.value)
		} else if (e.target.id === 'dateEnd') {
			setEndDate(e.target.value)
		}
	}

	return (
		<div className='flex flex-col gap-6'>
			{/* Control Panel */}
			<ControlPanel
				startDate={startDate}
				endDate={endDate}
				isLoading={isLoading}
				hasData={hasData}
				onDateChange={handleDateChange}
				onFetchData={fetchData}
				onDownloadExcel={downloadExcel}
			/>

			{/* Error Display */}
			{error && <ErrorDisplay error={error} />}

			{/* Data Table */}
			{hasData && (
				<DataContainer
					startDate={startDate}
					endDate={endDate}
					displayColumns={displayColumns}
					currentPageData={pagination.currentPageData}
					startRow={pagination.startRow}
					pagination={pagination}
				/>
			)}
		</div>
	)
}
