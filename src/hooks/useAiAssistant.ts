import { useMutation } from '@tanstack/react-query'
import { assistantService } from '@/services/assistant.service'
import toast from 'react-hot-toast'

export function useAiAssistant() {
	return useMutation({
		mutationFn: assistantService.askAi,
		onError: err => {
			toast.error(err.message)
		},
	})
}
