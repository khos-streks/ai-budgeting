import Cookies from 'js-cookie'

class CookieService {
	add(key: string, value: string) {
		Cookies.set(key, value)
	}

	get(key: string) {
		return Cookies.get(key)
	}

	remove(key: string) {
		Cookies.remove(key)
	}
}
export const cookieService = new CookieService()