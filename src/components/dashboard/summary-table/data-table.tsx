'use client'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { FormattedCell } from '@/lib/excel-utils'
import { DisplayColumn } from './types'

interface DataTableProps {
	displayColumns: DisplayColumn[]
	currentPageData: any[][]
	startRow: number
	formattedData?: FormattedCell[][]
	useFormatting?: boolean
}

export function DataTable({
	displayColumns,
	currentPageData,
	startRow,
	formattedData,
	useFormatting = false,
}: DataTableProps) {
	return (
		<div className='overflow-auto max-h-[500px]'>
			<Table>
				<TableHeader>
					<TableRow>
						{/* Row Number Column Header */}
						<TableHead className='w-14 text-center font-bold'>№</TableHead>
						{displayColumns.map((col, i) => (
							<TableHead key={i}>{col.title}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentPageData.map((row: any[], rowIndex: number) => (
						<TableRow key={rowIndex}>
							{/* Row Number Cell */}
							<TableCell className='text-center font-medium'>
								{startRow + rowIndex}
							</TableCell>
							{displayColumns.map((col, i) => {
								const formattedCell =
									useFormatting && formattedData
										? formattedData[rowIndex]?.[col.index]
										: null
								const cellStyle = formattedCell?.style || {}

								return (
									<TableCell
										key={i}
										style={{
											backgroundColor: cellStyle.backgroundColor,
											color: cellStyle.color,
											fontWeight: cellStyle.bold ? 'bold' : undefined,
											fontStyle: cellStyle.italic ? 'italic' : undefined,
										}}
									>
										{formattedCell
											? formattedCell.value?.toString() || ''
											: row[col.index]?.toString() || ''}
									</TableCell>
								)
							})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
