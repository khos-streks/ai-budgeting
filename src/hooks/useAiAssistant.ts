import { useMutation } from '@tanstack/react-query'
import { assistantService } from '@/services/assistant.service'

export function useAiAssistant() {
	return useMutation({
		mutationFn: assistantService.askAi,
	})
}