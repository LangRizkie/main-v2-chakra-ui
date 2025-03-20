import { ButtonProps } from '@chakra-ui/react'
import { create } from 'zustand'

type ButtonData = {
	activate: ButtonProps
	back: ButtonProps
	cancel: ButtonProps
	deactivate: ButtonProps
	reactivate: ButtonProps
	submit: ButtonProps
}

type UseButtonProps = Partial<ButtonData> & {
	setActivate: (state: ButtonProps) => void
	setBack: (state: ButtonProps) => void
	setCancel: (state: ButtonProps) => void
	setDeactivate: (state: ButtonProps) => void
	setReactivate: (state: ButtonProps) => void
	setSubmit: (state: ButtonProps) => void
	reset: () => void
}

const initial: Partial<ButtonData> = {
	activate: { colorPalette: 'teal', hidden: true, title: 'Activate' },
	back: { hidden: true, title: 'Back', variant: 'subtle' },
	cancel: { hidden: true, title: 'Cancel', variant: 'subtle' },
	deactivate: { colorPalette: 'red', hidden: true, title: 'Deactivate' },
	reactivate: { colorPalette: 'teal', hidden: true, title: 'Reactivate' },
	submit: { colorPalette: 'primary', hidden: true, title: 'Submit' }
}

const assign = Object.assign({}, initial)

const useButton = create<UseButtonProps>((set) => ({
	...assign,
	reset: () => set(initial),
	setActivate: (props) => set({ activate: { ...assign.activate, ...props } }),
	setBack: (props) => set({ back: { ...assign.back, ...props } }),
	setCancel: (props) => set({ cancel: { ...assign.cancel, ...props } }),
	setDeactivate: (props) => set({ deactivate: { ...assign.deactivate, ...props } }),
	setReactivate: (props) => set({ reactivate: { ...assign.reactivate, ...props } }),
	setSubmit: (props) => set({ submit: { ...assign.submit, ...props } })
}))

export default useButton
