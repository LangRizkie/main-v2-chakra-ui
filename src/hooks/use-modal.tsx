import { useContext } from 'react'
import { ModalContext } from '@/app/context'

const useModal = () => useContext(ModalContext)

export { useModal }
