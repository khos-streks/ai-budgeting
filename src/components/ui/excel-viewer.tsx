'use client'

import ExcelJS from 'exceljs'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const HEADER_MAP = {
	org: 'Організація',
	budget: 'Бюджет',
	cfo: 'CFO',
	budget_object: "Об'єкт бюджетування",
	budget_item: 'Стаття бюджету',
	macro_item: 'Макростаття',
}

const ROWS_PER_PAGE = 20

// Number formatters using Intl.NumberFormat
const formatters = {
	// Default number format (2 decimal places)
	default: new Intl.NumberFormat('uk-UA', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}),
	// Format for large numbers (2 decimal places)
	integer: new Intl.NumberFormat('uk-UA', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}),
	// Format for medium numbers (1 decimal place)
	oneDecimal: new Intl.NumberFormat('uk-UA', {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	}),
	// Format for small numbers (3 decimal places)
	threeDecimals: new Intl.NumberFormat('uk-UA', {
		minimumFractionDigits: 3,
		maximumFractionDigits: 3,
	}),
	// Format for percentages
	percent: new Intl.NumberFormat('uk-UA', {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}),
}

// Numeric column names that should always be formatted as numbers
const NUMERIC_COLUMNS = [
	'План',
	'Факт',
	'Відхилення (сума)',
	'Відхилення (%)',
	'Виконання (%)',
]

export function ExcelHtmlViewer({ file }: { file: File | Blob }) {
	const [rows, setRows] = useState<ExcelJS.CellValue[][]>([])
	const [page, setPage] = useState(1)
	const [direction, setDirection] = useState(0)

	const totalPages = Math.ceil((rows.length - 1) / ROWS_PER_PAGE)

	useEffect(() => {
		const loadExcel = async () => {
			try {
				const buffer = await file.arrayBuffer()
				const workbook = new ExcelJS.Workbook()
				await workbook.xlsx.load(buffer)

				const worksheet = workbook.worksheets[0]
				const parsed: ExcelJS.CellValue[][] = []

				worksheet.eachRow(row => {
					const values: ExcelJS.CellValue[] = []
					row.eachCell({ includeEmpty: true }, cell => {
						values.push(cell)
					})
					parsed.push(values)
				})

				// Create a mapping from header names to their column indices
				if (parsed.length > 0) {
					const headerMap: Record<string, number> = {}
					const headerRow = parsed[0]
					headerRow.forEach((cell: any, index) => {
						const headerName = cell?.value?.toString() || ''
						if (headerName) {
							headerMap[headerName] = index
						}
					})
				}

				setRows(parsed)
			} catch (error) {
				// console.error('Error loading Excel file:', error)
			}
		}

		if (file) {
			loadExcel()
		}
	}, [file])

	const renderPage = () => {
		if (!rows.length) return ''

		const headerRow = rows[0]
		const startIdx = 1 + (page - 1) * ROWS_PER_PAGE
		const endIdx = startIdx + ROWS_PER_PAGE
		const pageRows = rows.slice(startIdx, endIdx)

		let html = `<table border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse; width: 100%;">`
		html += '<thead><tr><th>#</th>'

		// Get header names for determining column types
		const headerNames: string[] = []
		headerRow.forEach((cell: any) => {
			const raw = cell?.value?.toString() || ''
			headerNames.push(raw)

			const mapped = HEADER_MAP[raw as keyof typeof HEADER_MAP] ?? raw
			html += `<th>${mapped}</th>`
		})

		html += '</tr></thead><tbody>'

		pageRows.forEach((row: any[], idx) => {
			html += '<tr>'
			html += `<td>${startIdx + idx}</td>`
			row.forEach((cell: any, colIdx) => {
				let value = cell?.value ?? ''
				let isNumber = false

				// Check if this column should be treated as a number
				const headerName = headerNames[colIdx] || ''
				const shouldFormatAsNumber = NUMERIC_COLUMNS.includes(headerName)

				// Format numbers using Intl.NumberFormat
				if (
					typeof value === 'number' ||
					(shouldFormatAsNumber && !isNaN(Number(value)))
				) {
					isNumber = true
					const numValue = typeof value === 'number' ? value : Number(value)
					const numFmt = cell.numFmt || ''
					const absValue = Math.abs(numValue)

					// Select appropriate formatter based on value and format
					if (numFmt.includes('%') || headerName.includes('%')) {
						// If column name contains '%', format as percentage
						if (numFmt.includes('%')) {
							value = formatters.percent.format(numValue)
						} else {
							// For columns like "Відхилення (%)" that are not stored as percentages
							value = formatters.default.format(numValue) + ' %'
						}
					} else if (absValue >= 10000) {
						value = formatters.integer.format(numValue)
					} else if (absValue >= 1000) {
						value = formatters.oneDecimal.format(numValue)
					} else if (absValue < 0.01 && absValue > 0) {
						value = formatters.threeDecimals.format(numValue)
					} else {
						value = formatters.default.format(numValue)
					}
				}

				const bg =
					cell?.fill?.type === 'pattern' ? cell.fill.fgColor?.argb : null
				const color = bg ? `#${bg.slice(2)}` : 'transparent'

				// Add text alignment based on type
				const textAlign = isNumber ? 'right' : 'left'

				html += `<td style="background-color:${color}; text-align:${textAlign}">${value}</td>`
			})
			html += '</tr>'
		})

		html += '</tbody></table>'
		return html
	}

	const variants = {
		enter: (dir: number) => ({
			x: dir > 0 ? 300 : -300,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (dir: number) => ({
			x: dir < 0 ? 300 : -300,
			opacity: 0,
		}),
	}

	const paginate = (newPage: number) => {
		if (newPage < 1 || newPage > totalPages) return
		setDirection(newPage > page ? 1 : -1)
		setPage(newPage)
	}

	return (
		<div className='max-w-full overflow-x-hidden'>
			<AnimatePresence initial={false} custom={direction} mode='wait'>
				<motion.div
					key={page}
					custom={direction}
					variants={variants}
					initial='enter'
					animate='center'
					exit='exit'
					transition={{ duration: 0.3 }}
					className='max-w-full overflow-x-auto'
					dangerouslySetInnerHTML={{ __html: renderPage() }}
				/>
			</AnimatePresence>
			{totalPages > 1 && (
				<div className='flex gap-2 justify-center mt-4'>
					<button
						onClick={() => paginate(page - 1)}
						disabled={page === 1}
						className='px-3 py-1 border rounded disabled:opacity-50 cursor-pointer'
					>
						<ArrowLeftIcon className='w-4 h-4' />
					</button>
					<span className='px-2 py-1'>
						{page} / {totalPages}
					</span>
					<button
						onClick={() => paginate(page + 1)}
						disabled={page === totalPages}
						className='px-3 py-1 border rounded disabled:opacity-50 cursor-pointer'
					>
						<ArrowRightIcon className='w-4 h-4' />
					</button>
				</div>
			)}
		</div>
	)
}
