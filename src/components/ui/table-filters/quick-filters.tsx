'use client'

import { Button } from '@/components/ui/button'
import { QuickFilterPreset } from '@/typing/filters'
import {
	AlertTriangle,
	Database,
	Factory,
	TrendingDown,
	TrendingUp,
	Truck,
	X,
} from 'lucide-react'

interface QuickFiltersProps {
	presets?: QuickFilterPreset[]
	onQuickFilter: (presetId: string) => void
}

const iconMap = {
	AlertTriangle,
	TrendingUp,
	TrendingDown,
	X,
	Database,
	Truck,
	Factory,
}

export function QuickFilters({ presets, onQuickFilter }: QuickFiltersProps) {
	return (
		<div className='flex flex-wrap gap-2 mb-4'>
			{!!presets && !!presets?.length && presets.map(preset => {
				const IconComponent = iconMap[preset.icon as keyof typeof iconMap] || X
				return (
					<Button
						key={preset.id}
						variant='outline'
						size='sm'
						onClick={() => onQuickFilter(preset.id)}
						className='h-8'
					>
						<IconComponent className='h-4 w-4 mr-1' />
						{preset.label}
					</Button>
				)
			})}
		</div>
	)
}
