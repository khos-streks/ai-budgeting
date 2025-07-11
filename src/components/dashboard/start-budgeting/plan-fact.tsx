import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog'

export function StartPlanFact() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>Запустити процес план-факт аналізу</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Запустити процес план-факт аналізу</DialogTitle>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
