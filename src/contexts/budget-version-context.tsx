'use client'

import { IBudgetVersion } from '@/typing/budget-version'
import { createContext, ReactNode, useContext, useState } from 'react'

interface BudgetVersionContextType {
	budgetVersion?: IBudgetVersion
	setBudgetVersion: (version: IBudgetVersion | undefined) => void
}

const BudgetVersionContext = createContext<
	BudgetVersionContextType | undefined
>(undefined)

export function BudgetVersionContextProvider({
	children,
}: {
	children: ReactNode
}) {
	const [budgetVersion, setBudgetVersion] = useState<
		IBudgetVersion | undefined
	>(undefined)

	return (
		<BudgetVersionContext.Provider
			value={{
				budgetVersion,
				setBudgetVersion,
			}}
		>
			{children}
		</BudgetVersionContext.Provider>
	)
}

export function useBudgetVersionContext() {
	const context = useContext(BudgetVersionContext)
	if (context === undefined) {
		throw new Error(
			'useBudgetVersionContext must be used within a DateProvider'
		)
	}
	return context
}
