import { mergeWith } from 'lodash'
import { redirect } from 'next/navigation'
import { ModalReference } from '@/app/context'
import useModalStore from '@/stores/modal-dynamic'
import type { Sizes, UseButtonProps } from '@/types/default'

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
		const pathname = location.pathname
		const parent = pathname.slice(0, pathname.lastIndexOf('/'))
		const last = document.referrer.startsWith(origin) ? history.back() : redirect(parent)

		new Promise((resolve) => {
			ModalReference.setOpen(false)
			setTimeout(() => {
				resolve(true)
			}, 200)
		})
			.then(() => props && props.shouldBack && last)
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
