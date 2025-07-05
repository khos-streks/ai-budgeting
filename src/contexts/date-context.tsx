'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

type DateRange = {
	startDate: string
	endDate: string
}

interface DateContextType {
	budgetingDateRange: DateRange
	planFactDateRange: DateRange
	setBudgetingDateRange: (range: Partial<DateRange>) => void
	setPlanFactDateRange: (range: Partial<DateRange>) => void
}

const defaultDateRange = {
	startDate: '2025-01-01',
	endDate: '2025-06-30',
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export function DateProvider({ children }: { children: ReactNode }) {
	const [budgetingDateRange, setBudgetingDates] =
		useState<DateRange>(defaultDateRange)
	const [planFactDateRange, setPlanFactDates] =
		useState<DateRange>(defaultDateRange)

	const setBudgetingDateRange = (range: Partial<DateRange>) => {
		setBudgetingDates(prev => ({ ...prev, ...range }))
	}

	const setPlanFactDateRange = (range: Partial<DateRange>) => {
		setPlanFactDates(prev => ({ ...prev, ...range }))
	}

	return (
		<DateContext.Provider
			value={{
				budgetingDateRange,
				planFactDateRange,
				setBudgetingDateRange,
				setPlanFactDateRange,
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
