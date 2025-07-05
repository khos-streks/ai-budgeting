import { api } from '@/lib/axios'

class AssistantService {
	async askAi(message: string) {
		return (await api.post('/assistant/ask', { message })).data
	}
}

export const assistantService = new AssistantService()
