import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { StartBudgeting as StartBudgetingDialog } from './budgeting'
import { StartPlanFact } from './plan-fact'

export function StartBudgeting() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Запустити процес генерації бюджету</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex gap-2 flex-wrap'>
					<StartBudgetingDialog />
					<StartPlanFact />
				</div>
			</CardContent>
		</Card>
	)
}
