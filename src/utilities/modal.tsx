import { mergeWith } from 'lodash'
import { ModalReference } from '@/app/context'
import useModalStore from '@/stores/modal-dynamic'
import { Sizes, UseButtonProps } from '@/types/default'

type ModalCreateOptions = UseButtonProps & {
	title: string
	size: Sizes
}

type ModalCloseProps = {
	shouldBack: boolean
}

type ModalCreateProps = {
	children: React.ReactNode
	options?: Partial<ModalCreateOptions>
}

const modal = {
	close: (props?: ModalCloseProps) => {
		new Promise((resolve) => {
			ModalReference.setOpen(false)
			setTimeout(() => {
				resolve(true)
			}, 200)
		})
			.then(() => props && props.shouldBack && history.back())
			.finally(() => useModalStore.getState().reset())
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
