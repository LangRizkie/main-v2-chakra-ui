import { Mutex } from 'async-mutex'
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { isEmpty } from 'lodash'
import { ReglaResponse } from '@/types/default'
import { AuthenticateResponse } from '@/types/user/common'
import endpoints from '@/utilities/endpoints'
import useUserProperty from '../stores/user-property'
import { routes } from '../utilities/constants'
import { deleteCredential, getCredential, setCredential } from '../utilities/credentials'
import toast from '../utilities/toast'

const mutex = new Mutex()

export const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_API,
	headers: {
		Accept: 'application/json',
		'x-Appid': process.env.NEXT_PUBLIC_APP_ID
	}
})

const request = async (config: InternalAxiosRequestConfig) => {
	const { credential } = await getCredential()

	if (credential) {
		config.headers.Authorization = ['Bearer', credential].join(' ')
	}

	return config
}

export const logout = async (credential: string) => {
	const callback = [location.pathname, location.search].join('')

	const headers = new Headers()

	headers.append('content-type', 'application/json')
	headers.append('x-appid', process.env.NEXT_PUBLIC_APP_ID || '')
	headers.append('Authorization', credential)

	await fetch(process.env.NEXT_PUBLIC_BASE_API + endpoints.user.common.logout, {
		headers: headers,
		method: 'POST'
	})

	await deleteCredential()
	useUserProperty.getState().reset()

	location.href = [routes.login, '?callback=', callback].join('')
}

instance.interceptors.request.use(request)
instance.interceptors.response.use(
	(response: AxiosResponse<ReglaResponse>) => {
		const redirect = {
			replace: response.config.headers['x-redirect-replace'],
			url: response.config.headers['x-redirect-url']
		}

		const useToast = !!response.config.headers['x-toast']

		const isEmptyData = isEmpty(response.data.data)
		const isEmptyMessage = isEmpty(response.data.message)

		if (useToast && isEmptyData && !isEmptyMessage) {
			toast.success({
				duration: 1200,
				onStatusChange: ({ status }) => {
					if (status === 'unmounted' && !isEmpty(redirect.url)) {
						if (redirect.replace) location.replace(redirect.url)
						else location.href = redirect.url
					}
				},
				title: response.data.message
			})
		}

		if (!useToast && !isEmpty(redirect.url)) {
			if (redirect.replace) location.replace(redirect.url)
			else location.href = redirect.url
		}

		return Promise.resolve(response)
	},
	async (error) => {
		const property = useUserProperty.getState()
		const message = error.response?.data?.message ? error.response.data.message : error.message

		if (error.status === 401) {
			const release = await mutex.acquire()

			if (property) {
				const { username } = property
				const { credential, refresh } = await getCredential()

				if (username && refresh && credential) {
					const headers = new Headers()

					headers.append('content-type', 'application/json')
					headers.append('x-appid', process.env.NEXT_PUBLIC_APP_ID || '')
					headers.append('Authorization', credential.toString())

					await fetch(process.env.NEXT_PUBLIC_BASE_API + endpoints.user.common.refresh_token, {
						body: JSON.stringify({ refreshToken: refresh.toString(), username }),
						headers: headers,
						method: 'POST'
					})
						.then(async (res) => {
							const response: AuthenticateResponse = await res.json()
							await setCredential(response)
							release()

							return instance(error.config)
						})
						.catch(async () => {
							await logout(credential.toString())
						})
				}
			}
		} else {
			toast.error({ title: message })
		}

		if (error.response) return Promise.reject(error.response.data)
		return Promise.reject(error)
	}
)
