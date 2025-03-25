const endpoints = {
	parameter: {
		dropdown: {
			get_format_export_file: '/parameter/Dropdown/GetFormatExportFile',
			get_type_export_file: '/parameter/Dropdown/GetTypeExportFile'
		}
	},
	platform_settings: {
		master_application: {
			get_platform: '/platform-settings/MasterApplication/GetPlatform'
		}
	},
	user: {
		check_otp: '/user/CheckOTP',
		common: {
			authenticate: '/user/Common/Authenticate',
			check_username: '/user/Common/CheckUsername',
			forgot: '/user/Common/ForgotPassword',
			get_all_navigation_screen: '/user/Common/GetAllNavigationScreen',
			get_lookup_custom_view: '/user/Common/GetLookupCustomView',
			get_navigation_screen: '/user/Common/GetNavigationScreen',
			get_user_property: '/user/Common/GetUserProperty',
			logout: '/user/Common/Logout',
			refresh_token: '/user/Common/RefreshToken',
			reset_with_token: '/user/Common/ResetPasswordWithToken'
		},
		request_unlock_account: '/user/RequestUnlockAccount',
		resend_otp_unlock_account: '/user/ResendOTPUnlockAccount',
		screen: {
			get_path_url_screen: '/user/Screen/GetPathUrlScreen'
		},
		security_role: {
			get_privilege: '/user/SecurityRole/GetPrivilege'
		},
		unlock_account: '/user/UnlockAccount'
	}
}

export default endpoints
