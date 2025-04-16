import { PagingResponse } from '@/types/email/user/notification/list'
import { PaginationPayload } from '@/types/list'
import endpoints from '@/utilities/endpoints'
import { post } from '@/utilities/mutation'

const Paging = async (payload: PaginationPayload): Promise<PagingResponse> =>
	await post(endpoints.email.user.notification.list.paging, payload)

export { Paging }
