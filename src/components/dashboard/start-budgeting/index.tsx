import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { StartBudgeting as StartBudgetingDialog } from './budgeting'

export function StartBudgeting() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Запустити процес генерації бюджету</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex gap-2 flex-wrap'>
					<StartBudgetingDialog />
				</div>
			</CardContent>
		</Card>
	)
}
