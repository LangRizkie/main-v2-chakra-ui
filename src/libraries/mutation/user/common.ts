import type {
	AuthenticatePayload,
	ChangePasswordPayload,
	CheckUsernamePayload,
	ResetPasswordWithTokenPayload
} from '@/libraries/schemas/user/common'
import type { ReglaResponse } from '@/types/default'
import type {
	AuthenticateResponse,
	CheckUsernameResponse,
	ForgotPasswordPayload,
	GetUserPropertyResponse
} from '@/types/user/common'
import { routes } from '@/utilities/constants'
import endpoints from '@/utilities/endpoints'
import { get, post, put } from '@/utilities/mutation'

const CheckUsername = async (payload: CheckUsernamePayload): Promise<CheckUsernameResponse> =>
	await post(endpoints.user.common.check_username, payload, {
		asParameter: true,
		useToast: false
	})

const Authenticate = async (payload: AuthenticatePayload): Promise<AuthenticateResponse> =>
	await post(endpoints.user.common.authenticate, payload)

const GetUserProperty = async (): Promise<GetUserPropertyResponse> =>
	await get(endpoints.user.common.get_user_property)

const ForgotPassword = async (payload: ForgotPasswordPayload): Promise<ReglaResponse> =>
	await post(endpoints.user.common.forgot_pass, payload, {
		asParameter: true,
		useToast: false
	})

const ChangePassword = async (payload: ChangePasswordPayload): Promise<ReglaResponse> =>
	await put(endpoints.user.common.change_pass, payload)

const ResetPasswordWithToken = async (
	payload: ResetPasswordWithTokenPayload
): Promise<ReglaResponse> =>
	await post(endpoints.user.common.reset_pass_with_token, payload, {
		redirectTo: { replace: true, url: routes.login }
	})

export {
	Authenticate,
	ChangePassword,
	CheckUsername,
	ForgotPassword,
	GetUserProperty,
	ResetPasswordWithToken
}
