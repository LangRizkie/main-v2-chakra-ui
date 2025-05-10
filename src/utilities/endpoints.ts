const endpoints = {
	email: {
		notification_hub: '/email/NotificationHub',
		notification_noise_hub: '/email/NotificationNoiseHub'
	},
	user: {
		application: {
			get_platform: '/user/Application/GetPlatform'
		},
		check_otp: '/user/CheckOTP',
		common: {
			authenticate: '/user/Common/Authenticate',
			change_pass: '/user/Common/ChangePassword',
			check_username: '/user/Common/CheckUsername',
			forgot_pass: '/user/Common/ForgotPassword',
			get_user_property: '/user/Common/GetUserProperty',
			logout: '/user/Common/Logout',
			refresh_token: '/user/Common/RefreshToken',
			reset_pass_with_token: '/user/Common/ResetPasswordWithToken'
		},
		request_unlock_account: '/user/RequestUnlockAccount',
		resend_otp_unlock_account: '/user/ResendOTPUnlockAccount',
		security_role: {
			get_privilege: '/user/SecurityRole/GetPrivilege'
		},
		unlock_account: '/user/UnlockAccount'
	}
}

export default endpoints
