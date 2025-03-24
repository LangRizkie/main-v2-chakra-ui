const routes = {
	forgot: '/forgot-password',
	login: '/',
	main: '/main',
	request_unlock: '/request-unlock',
	request_unlock_email: '/request-unlock/email',
	request_unlock_otp: '/request-unlock/otp'
}

const crud_routes = {
	create: '/create',
	custom_view: '/custom_view',
	update: '/update',
	view: '/view'
}

const cookies = {
	credential: 'credential',
	refresh: 'refresh',
	session: 'session'
}

const storages = {
	username: 'username'
}

export { cookies, crud_routes, routes, storages }
