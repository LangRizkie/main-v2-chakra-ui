'use client'

import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react'
import { useNetwork } from 'ahooks'
import { createContext, useEffect } from 'react'
import { Layout } from '@/types/default'
import toast from '@/utilities/toast'

export const ModalReference: UseDisclosureReturn = {
	onClose: () => {},
	onOpen: () => {},
	onToggle: () => {},
	open: false,
	setOpen: () => {}
}

export const ModalContext = createContext<UseDisclosureReturn>(ModalReference)

const Context: React.FC<Layout> = ({ children }) => {
	const modal = useDisclosure()
	const network = useNetwork()

	useEffect(() => {
		if (!network.online) {
			toast.error({
				description: 'You seems to be offline, please check your internet connection.',
				title: 'Disconnected'
			})
		}
	}, [network.online])

	Object.assign(ModalReference, modal)

	return <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>
}

export default Context
