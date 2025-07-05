'use client'

import { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

const HEADER_MAP = {
	org: 'Організація',
	budget: 'Бюджет',
	cfo: 'CFO',
	budget_object: 'Об’єкт бюджетування',
	budget_item: 'Стаття бюджету',
	macro_item: 'Макростаття',
}

const ROWS_PER_PAGE = 20

export function ExcelHtmlViewer({ file }: { file: File }) {
	const [rows, setRows] = useState<ExcelJS.CellValue[][]>([])
	const [page, setPage] = useState(1)
	const [direction, setDirection] = useState(0) // -1 назад, 1 вперед

	const totalPages = Math.ceil((rows.length - 1) / ROWS_PER_PAGE)

	useEffect(() => {
		const loadExcel = async () => {
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

			setRows(parsed)
		}

		loadExcel()
	}, [file])

	const renderPage = () => {
		if (!rows.length) return ''

		const headerRow = rows[0]
		const startIdx = 1 + (page - 1) * ROWS_PER_PAGE
		const endIdx = startIdx + ROWS_PER_PAGE
		const pageRows = rows.slice(startIdx, endIdx)

		let html = `<table border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse; width: 100%;">`
		html += '<thead><tr><th>#</th>'

		headerRow.forEach((cell: any) => {
			const raw = cell?.value ?? ''
			const mapped = HEADER_MAP[raw as keyof typeof HEADER_MAP] ?? raw
			html += `<th>${mapped}</th>`
		})

		html += '</tr></thead><tbody>'

		pageRows.forEach((row: any[], idx) => {
			html += '<tr>'
			html += `<td>${startIdx + idx}</td>`
			row.forEach((cell: any) => {
				const value = cell?.value ?? ''
				const bg =
					cell?.fill?.type === 'pattern' ? cell.fill.fgColor?.argb : null
				const color = bg ? `#${bg.slice(2)}` : 'transparent'
				html += `<td style="background-color:${color}">${value}</td>`
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
