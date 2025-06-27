'use client'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { DisplayColumn } from './types'

interface DataTableProps {
	displayColumns: DisplayColumn[]
	currentPageData: any[][]
	startRow: number
}

export function DataTable({
	displayColumns,
	currentPageData,
	startRow,
}: DataTableProps) {
	return (
		<div className='overflow-auto max-h-[500px]'>
			<Table>
				<TableHeader>
					<TableRow>
						{/* Row Number Column Header */}
						<TableHead className='sticky left-0 bg-background z-20 w-14 text-center font-bold'>
							№
						</TableHead>
						{displayColumns.map((col, i) => (
							<TableHead
								key={i}
								className={i < 6 ? 'sticky left-14 bg-background z-10' : ''}
							>
								{col.title}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentPageData.map((row: any[], rowIndex: number) => (
						<TableRow key={rowIndex}>
							{/* Row Number Cell */}
							<TableCell className='sticky left-0 bg-background z-20 text-center font-medium'>
								{startRow + rowIndex}
							</TableCell>
							{displayColumns.map((col, i) => (
								<TableCell
									key={i}
									className={i < 6 ? 'sticky left-14 bg-background z-10' : ''}
								>
									{row[col.index]?.toString() || ''}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
