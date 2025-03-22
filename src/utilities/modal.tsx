import { mergeWith } from 'lodash'
import { ModalReference } from '@/app/context'
import useModalStore from '@/stores/modal-dynamic'
import { UseButtonProps } from '@/types/default'

type ModalCreateOptions = UseButtonProps & {
	title: string
}

type ModalCreateProps = {
	children: React.ReactNode
	options?: Partial<ModalCreateOptions>
}

const modal = {
	close: () => {
		ModalReference.setOpen(false)
		useModalStore.getState().reset()
	},
	create: (props: ModalCreateProps) => {
		ModalReference.setOpen(true)
		useModalStore.setState((state) => ({
			...mergeWith(state, props.options),
			content: props.children
		}))
	}
}

export default modal
