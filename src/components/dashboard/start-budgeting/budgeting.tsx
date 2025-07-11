import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog'

export function StartBudgeting() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Запустити процес бюджетування</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Запустити процес бюджетування</DialogTitle>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
