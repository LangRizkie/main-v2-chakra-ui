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
	update: '/update',
	view: '/view'
}

const exception_routes = {
	custom_view: '/custom_view',
	notification: '/notification',
	profile: '/profile',
	search: '/search'
}

const cookies = {
	credential: 'credential',
	refresh: 'refresh',
	session: 'session'
}

const storages = {
	histories: 'histories',
	username: 'username'
}

export { cookies, crud_routes, exception_routes, routes, storages }
