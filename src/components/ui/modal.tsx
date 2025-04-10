import { Button, ButtonGroup, CloseButton, Dialog, HStack, Portal } from '@chakra-ui/react'
import { useMemo } from 'react'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import { useModal } from '@/hooks/use-page'
import useModalStore from '@/stores/modal-dynamic'
import modal from '@/utilities/modal'

const Modal = () => {
	const isCRUDPath = useIsCRUDPath()

	const { open } = useModal()
	const { activate, cancel, content, deactivate, reactivate, size, submit, title } =
		useModalStore()

	const isGroupLoading = useMemo(() => {
		return activate?.loading || deactivate?.loading || reactivate?.loading || submit?.loading
	}, [activate?.loading, deactivate?.loading, reactivate?.loading, submit?.loading])

	return (
		<Dialog.Root
			motionPreset="slide-in-top"
			open={open}
			placement="center"
			scrollBehavior="inside"
			size={size}
			unmountOnExit
			onOpenChange={() => modal.close({ shouldBack: isCRUDPath })}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{title}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body paddingTop="0">{content}</Dialog.Body>
						<Dialog.Footer as={ButtonGroup}>
							<HStack width="full">
								<Button {...activate} disabled={activate?.disabled || isGroupLoading}>
									{activate?.children || activate?.title}
								</Button>
								<Button {...deactivate} disabled={deactivate?.disabled || isGroupLoading}>
									{deactivate?.children || deactivate?.title}
								</Button>
								<Button {...reactivate} disabled={reactivate?.disabled || isGroupLoading}>
									{reactivate?.children || reactivate?.title}
								</Button>
							</HStack>
							<Dialog.ActionTrigger asChild>
								<Button {...cancel}>{cancel?.children || cancel?.title}</Button>
							</Dialog.ActionTrigger>
							<Button
								colorPalette="primary"
								{...submit}
								disabled={submit?.disabled || isGroupLoading}
							>
								{submit?.children || submit?.title}
							</Button>
						</Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Dialog.CloseTrigger>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	)
}

export default Modal
