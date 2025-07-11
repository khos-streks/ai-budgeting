import {
	ConsolidatedFilters,
	PlanFactFilters,
	QuickFilterPreset,
} from '@/typing/filters'
import { useState } from 'react'

export function useTableFilters(quickFilterPresets: QuickFilterPreset[] = []) {
	const [filters, setFilters] = useState<PlanFactFilters | ConsolidatedFilters>(
		{}
	)
	const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

	const handleFilterChange = (key: string, value: string) => {
		setFilters(prev => ({
			...prev,
			[key]: value === 'all' ? undefined : value,
		}))
	}

	const clearAllFilters = () => {
		setFilters({})
	}

	const hasActiveFilters = Object.values(filters).some(
		value => value !== undefined
	)

	// Quick filter presets
	const applyQuickFilter = (presetId: string) => {
		const preset = quickFilterPresets.find(p => p.id === presetId)
		if (preset) {
			setFilters({
				...filters,
				...preset.filters,
			})
		} else {
			clearAllFilters()
		}
	}

	const toggleFiltersExpanded = () => {
		setIsFiltersExpanded(!isFiltersExpanded)
	}

	return {
		filters,
		isFiltersExpanded,
		hasActiveFilters,
		handleFilterChange,
		clearAllFilters,
		applyQuickFilter,
		toggleFiltersExpanded,
	}
}
