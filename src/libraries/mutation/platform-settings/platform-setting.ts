import type { Key } from 'react'
import type { AccountActiveUserPayload } from '@/libraries/schemas/platform-settings/platform-setting'
import type { ReglaResponse } from '@/types/default'
import endpoints from '@/utilities/endpoints'
import { get, post } from '@/utilities/mutation'

const GenerateRandomPassword = async (): Promise<ReglaResponse> =>
	await get(endpoints.platform_settings.generate_random, undefined, { useToast: false })

const GetApplicationBySubsId = async (payload: Key) =>
	await get(
		endpoints.platform_settings.master_subscription_package.get_application_by_subs_id + payload
	)

const GetBySubscriptionId = async (payload: Key) =>
	await get(endpoints.platform_settings.license.get_by_subscription_id + payload)

const AddAccountActiveUser = async (
	payload: AccountActiveUserPayload
): Promise<ReglaResponse> =>
	await post(endpoints.platform_settings.add_account_active_user, payload)

const UpdateAccountActiveUser = async (
	payload: AccountActiveUserPayload
): Promise<ReglaResponse> =>
	await post(endpoints.platform_settings.add_account_active_user, payload)

export {
	AddAccountActiveUser,
	GenerateRandomPassword,
	GetApplicationBySubsId,
	GetBySubscriptionId,
	UpdateAccountActiveUser
}
