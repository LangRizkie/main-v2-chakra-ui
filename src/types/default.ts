import type { ButtonProps } from '@chakra-ui/react'

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
	recordsTotal: number
	isRequestApproval: boolean
	isApproval: boolean
	returnId: KeyType
}
export interface ButtonData {
	activate: ButtonProps
	back: ButtonProps
	cancel: ButtonProps
	deactivate: ButtonProps
	reactivate: ButtonProps
	submit: ButtonProps
}

export type ButtonKeys = keyof ButtonData
export type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'cover' | 'full'

export interface UseButtonProps extends Partial<ButtonData> {
	setActivate: (state: ButtonProps) => void
	setBack: (state: ButtonProps) => void
	setCancel: (state: ButtonProps) => void
	setDeactivate: (state: ButtonProps) => void
	setReactivate: (state: ButtonProps) => void
	setSubmit: (state: ButtonProps) => void
	reset: () => void
}
