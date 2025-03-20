export interface Layout {
	[name: string]: React.ReactNode
}

export interface Data<T> {
	data: T extends null ? null : T
}

export interface MessageObject {
	activity: string
	detail_log: string
	detail_log_download: string
	error_id: string
	message: string
}

export interface ReglaResponse<T = null> extends Data<T> {
	isSuccess: boolean
	statusCode?: number
	message: string
	message_object: MessageObject | null
	historyApprovalUrl: string
	isRequestApproval: boolean
	isApproval: boolean
	returnId: KeyType
}
