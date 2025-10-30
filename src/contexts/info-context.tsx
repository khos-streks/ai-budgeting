'use client'

import { IBudgetVersion } from '@/typing/budget-version'
import dynamic from 'next/dynamic'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

interface InfoContextType {
	startDate: string
	endDate: string
	budgetVersion?: IBudgetVersion
	setStartDate: (date: string) => void
	setEndDate: (date: string) => void
	setBudgetVersion: (version: IBudgetVersion | undefined) => void
}

const InfoContext = createContext<InfoContextType | undefined>(undefined)

export function Provider({ children }: { children: ReactNode }) {
	const [startDate, setStartDateState] = useState<string>(
		localStorage.getItem('startDate') ?? `${new Date().getFullYear()}-01-01`
	)
	const [endDate, setEndDateState] = useState<string>(
		localStorage.getItem('endDate') ?? `${new Date().getFullYear()}-12-31`
	)
	const [budgetVersion, setBudgetVersionState] = useState<
		IBudgetVersion | undefined
	>(undefined)

	useEffect(() => {
		if (!localStorage.getItem('startDate'))
			setStartDate(`${new Date().getFullYear()}-01-01`)

		if (!localStorage.getItem('endDate'))
			setEndDate(`${new Date().getFullYear()}-12-31`)
	}, [])

	const setStartDate = (date: string) => {
		if (!date) return
		setStartDateState(date)
		localStorage.setItem('startDate', date)
	}

	const setEndDate = (date: string) => {
		if (!date) return
		setEndDateState(date)
		localStorage.setItem('endDate', date)
	}

	const setBudgetVersion = (budgetVersion: IBudgetVersion | undefined) => {
		if (!budgetVersion) return
		setBudgetVersionState(budgetVersion)
		localStorage.setItem('budgetVersion', JSON.stringify(budgetVersion))
	}

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

export const InfoContextProvider = dynamic(() => Promise.resolve(Provider), {
	ssr: false,
})

export function useInfoContext() {
	const context = useContext(InfoContext)
	if (context === undefined) {
		throw new Error('useInfoContext must be used within a InfoContextProvider')
	}
	return context
}
