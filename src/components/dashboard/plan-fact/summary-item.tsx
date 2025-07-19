'use client'

import { formatValue, getLabel, getNumericValue } from './summary-utils'

interface SummaryItemProps {
	itemKey: string
	value: any
}

export function SummaryItem({ itemKey, value }: SummaryItemProps) {
	return (
		<div className='bg-card border rounded-lg p-4 flex flex-col shadow-sm'>
			<div className='text-sm text-muted-foreground mb-1'>
				{getLabel(itemKey)}
			</div>
			<div
				className={`text-2xl font-bold ${
					itemKey === 'execution_percent' && getNumericValue(value) > 100
						? 'text-green-600'
						: itemKey === 'execution_percent' && getNumericValue(value) < 100
						? 'text-red-600'
						: ''
				}`}
			>
				{value !== undefined ? formatValue(itemKey, value) : 'Н/Д'}
			</div>
		</div>
	)
}
