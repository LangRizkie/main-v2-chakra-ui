import { useDisclosure, UseDisclosureReturn } from '@chakra-ui/react'
import React, { createContext } from 'react'
import { Layout } from '@/types/default'

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

	Object.assign(ModalReference, modal)

	return <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>
}

export default Context
