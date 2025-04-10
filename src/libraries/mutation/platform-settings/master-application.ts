import type { GetPlatformResponse } from '@/types/platform-settings/master-application'
import endpoints from '@/utilities/endpoints'
import { get } from '@/utilities/mutation'

const GetPlatform = async (): Promise<GetPlatformResponse> =>
	await get(endpoints.platform_settings.master_application.get_platform)

export { GetPlatform }
