import type { Key } from 'react'
import type { ReglaResponse } from '../default'

export type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type GetLookupData = {
	id: Key
	desc: string
}

export type ResponseUserData = {
	is_user_locked: boolean
}

export type AuthenticateData = {
	token: string
	tokenExpired: number
	refreshToken: string
	password_expired: boolean
	tokenExpiredDate: string
	session_id: string
}

export type GetUserPropertyApplication = {
	appId: string
	applicationName: string
	url: string
	image_url: string
	description: string
}

export type GetUserPropertyData = {
	pkid: number
	username: string
	email: string
	firstName: string
	lastName: string
	lastLogin: string
	passwordExpired: boolean
	role: string
	organization: string
	team: string
	jobTitle: string
	department: string
	officeCountry: string
	isInitPassword: boolean
	accept_language: string
	is_dark_mode: boolean
	application: GetUserPropertyApplication[]
}

export type ForgotPasswordPayload = {
	username: string
}

export type RefreshTokenPayload = {
	username: string
	refreshToken: string
}

export type CheckUsernameResponse = ReglaResponse<ResponseUserData | null>
export type AuthenticateResponse = ReglaResponse & AuthenticateData
export type GetUserPropertyResponse = ReglaResponse & GetUserPropertyData
