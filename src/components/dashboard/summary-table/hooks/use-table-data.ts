import { useBudgeting } from '@/hooks/useBudgeting'
import { useEffect, useState } from 'react'
import { COLUMN_MAPPINGS, DisplayColumn } from '../types'
import { detectDateColumns, mapColumnTitles, processXLSXData } from '../utils'

export function useTableData(startDate: string, endDate: string) {
	// State
	const [isActive, setIsActive] = useState(false)
	const [tableData, setTableData] = useState<Array<Array<any>>>([])
	const [displayColumns, setDisplayColumns] = useState<DisplayColumn[]>([])

	// Query
	const { data, isLoading, error, refetch } = useBudgeting(
		startDate,
		endDate,
		isActive
	)

	// Process XLSX data when received
	useEffect(() => {
		if (data) handleProcessData(data)
	}, [data])

	// Process the data when received
	const handleProcessData = async (blob: Blob) => {
		try {
			const { jsonData, headers, dataRows } = await processXLSXData(blob)

			setTableData(jsonData)

			// Process columns
			if (jsonData.length > 0) {
				// Detect date columns
				const detectedDateColumns = detectDateColumns(
					headers,
					dataRows.slice(0, 5)
				)

				// Map column titles
				const columnTitles = mapColumnTitles(headers, COLUMN_MAPPINGS)

				// Create display columns - all columns except dates
				const columns = headers
					.map((header, index) => ({
						index,
						title:
							columnTitles[index] ||
							header?.toString() ||
							`Column ${index + 1}`,
					}))
					.filter(col => !detectedDateColumns.includes(col.index))

				setDisplayColumns(columns)
			}
		} catch (err) {
			console.error('Error processing XLSX data:', err)
			setTableData([])
			setDisplayColumns([])
		}
	}

	const fetchData = () => {
		setIsActive(true)
		refetch()
	}

	// Download functionality
	const downloadExcel = () => {
		if (!data) return

		const blob = new Blob([data], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		})

		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `budget-report-${startDate}-${endDate}.xlsx`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	return {
		tableData,
		displayColumns,
		isLoading,
		error,
		hasData: tableData.length > 0 && displayColumns.length > 0,
		fetchData,
		downloadExcel,
	}
}
