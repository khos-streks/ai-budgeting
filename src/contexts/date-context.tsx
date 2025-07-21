'use client'

import { IBudgetVersion } from '@/typing/budget-version'
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react'

type DateRange = {
	startDate: string
	endDate: string
	budgetVersion?: IBudgetVersion
}

interface DateContextType {
	dateRange: DateRange
	setDateRange: Dispatch<SetStateAction<DateRange>>
	setBudgetVersion: (version: IBudgetVersion | undefined) => void
}

const defaultDateRange = {
	startDate: '2025-01-01',
	endDate: '2025-06-30',
	budgetVersion: undefined,
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export function DateProvider({ children }: { children: ReactNode }) {
	const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)

	const setBudgetVersion = (version: IBudgetVersion | undefined) => {
		setDateRange(prev => ({
			...prev,
			budgetVersion: version,
		}))
	}

	return (
		<DateContext.Provider
			value={{
				dateRange,
				setDateRange,
				setBudgetVersion,
			}}
		>
			{children}
		</DateContext.Provider>
	)
}

export function useDateContext() {
	const context = useContext(DateContext)
	if (context === undefined) {
		throw new Error('useDateContext must be used within a DateProvider')
	}
	return context
}
