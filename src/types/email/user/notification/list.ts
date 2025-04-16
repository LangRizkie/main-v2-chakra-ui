import { ReglaResponse } from '@/types/default'

export type PagingData = {
	created_date: string
	is_read: boolean
	message: string
	notification_id: string
	redirect_url: string
}

export type PagingResponse = ReglaResponse<PagingData[]>
