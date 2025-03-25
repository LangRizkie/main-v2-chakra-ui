import { Button, CloseButton, Dialog, HStack, Portal } from '@chakra-ui/react'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import { useModal } from '@/hooks/use-modal'
import useModalStore from '@/stores/modal-dynamic'
import modal from '@/utilities/modal'

const Modal = () => {
	const isCRUDPath = useIsCRUDPath()

	const { open } = useModal()
	const { activate, cancel, content, deactivate, reactivate, size, submit, title } =
		useModalStore()

	return (
		<Dialog.Root
			open={open}
			size={size}
			placement="center"
			scrollBehavior="inside"
			motionPreset="slide-in-top"
			onOpenChange={() => modal.close({ shouldBack: isCRUDPath })}
			unmountOnExit
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{title}</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>{content}</Dialog.Body>
						<Dialog.Footer>
							<HStack width="full">
								<Button {...activate}>{activate?.children || activate?.title}</Button>
								<Button {...deactivate}>{deactivate?.children || deactivate?.title}</Button>
								<Button {...reactivate}>{reactivate?.children || reactivate?.title}</Button>
							</HStack>
							<Dialog.ActionTrigger asChild>
								<Button {...cancel}>{cancel?.children || cancel?.title}</Button>
							</Dialog.ActionTrigger>
							<Button colorPalette="primary" {...submit}>
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
