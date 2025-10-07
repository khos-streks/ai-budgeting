'use client'

import { IBudgetVersion } from '@/typing/budget-version'
import { createContext, ReactNode, useContext, useState } from 'react'

interface InfoContextType {
	startDate: string
	endDate: string
	budgetVersion?: IBudgetVersion
	setStartDate: (date: string) => void
	setEndDate: (date: string) => void
	setBudgetVersion: (version: IBudgetVersion | undefined) => void
}

const InfoContext = createContext<InfoContextType | undefined>(undefined)

export function InfoContextProvider({ children }: { children: ReactNode }) {
	const [startDate, setStartDate] = useState<string>(
		`${new Date().getFullYear()}-01-01`
	)
	const [endDate, setEndDate] = useState<string>(
		`${new Date().getFullYear()}-12-31`
	)
	const [budgetVersion, setBudgetVersion] = useState<
		IBudgetVersion | undefined
	>(undefined)

	return (
		<InfoContext.Provider
			value={{
				startDate,
				endDate,
				budgetVersion,
				setBudgetVersion,
				setStartDate,
				setEndDate,
			}}
		>
			{children}
		</InfoContext.Provider>
	)
}

export function useInfoContext() {
	const context = useContext(InfoContext)
	if (context === undefined) {
		throw new Error('useInfoContext must be used within a InfoContextProvider')
	}
	return context
}
