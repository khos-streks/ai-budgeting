'use client'

import { useState } from 'react'
import { AnomaliesDialog } from './anomalies-dialog'
import { AnomalyData, getLabel } from './summary-utils'

interface AnomaliesItemProps {
	value: number
	anomalies: AnomalyData | null | undefined
}

export function AnomaliesItem({ value, anomalies }: AnomaliesItemProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	return (
		<div className='bg-card border rounded-lg p-4 flex flex-col shadow-sm'>
			<div className='text-sm text-muted-foreground mb-1'>
				{getLabel('anomalies_count')}
			</div>
			<div>
				<AnomaliesDialog
					anomalies={anomalies}
					isOpen={isDialogOpen}
					onOpenChange={setIsDialogOpen}
					anomaliesCount={value}
				/>
			</div>
		</div>
	)
}
