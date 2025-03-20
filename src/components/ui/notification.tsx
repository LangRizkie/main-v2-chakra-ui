'use client'

import { Portal, Show, Spinner, Stack, Toast, Toaster } from '@chakra-ui/react'
import toast from '@/utilities/toast'

const ToastType = ({ isLoading }: { isLoading: boolean }) => {
	if (isLoading) return <Spinner size="sm" color="primary.500" />
	return <Toast.Indicator />
}

const Notification = () => {
	return (
		<Portal>
			<Toaster toaster={toast} insetInline={{ mdDown: '4' }}>
				{({ action, description, meta, title, type }) => (
					<Toast.Root width={{ md: 'sm' }}>
						<ToastType isLoading={type === 'loading'} />
						<Stack gap="1" flex="1" maxWidth="full">
							<Show when={Boolean(title)}>
								<Toast.Title>{title}</Toast.Title>
							</Show>
							<Show when={Boolean(description)}>
								<Toast.Description>{description}</Toast.Description>
							</Show>
						</Stack>
						<Show when={Boolean(action)}>
							<Toast.ActionTrigger>{action?.label}</Toast.ActionTrigger>
						</Show>
						<Show when={Boolean(meta?.closable)}>
							<Toast.CloseTrigger />
						</Show>
					</Toast.Root>
				)}
			</Toaster>
		</Portal>
	)
}

export default Notification
