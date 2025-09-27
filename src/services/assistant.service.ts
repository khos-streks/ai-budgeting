import { api } from '@/lib/axios'
import { cookieService } from './cookie.service'
import { AUTH_KEYS } from '@/typing/enums'

class AssistantService {
	async askAi({ message }: { message: string }) {
		const userId = cookieService.get(AUTH_KEYS.USER_ID)
		const res = await api.post('/assistant/ask', {
			message,
			user_id: userId,
		})
		if (!userId || !userId.length) {
			cookieService.add(AUTH_KEYS.USER_ID, res.data.user_id)
		}
		return res.data
	}
}

export const assistantService = new AssistantService()
