import { ButtonProps } from '@chakra-ui/react'
import React from 'react'
import { create } from 'zustand'
import { ButtonData, ButtonKeys, UseButtonProps } from '@/types/default'

type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'cover' | 'full'

type ModalContent = {
	content: React.ReactNode
	title?: string
	size?: Sizes
	setSize: (value: Sizes) => void
	setAttribute: (key: ButtonKeys, props: ButtonProps) => void
	setContent: (children: React.ReactNode) => void
	setTitle: (value: string) => void
	getTitle: () => string | undefined
}

const initial: Partial<ButtonData & ModalContent> = {
	activate: { colorPalette: 'teal', form: 'activate-form', hidden: true, title: 'Activate' },
	back: { hidden: true, title: 'Back', variant: 'subtle' },
	cancel: { hidden: false, title: 'Cancel', variant: 'ghost' },
	content: <></>,
	deactivate: {
		colorPalette: 'red',
		form: 'deactivate-form',
		hidden: true,
		title: 'Deactivate'
	},
	reactivate: {
		colorPalette: 'teal',
		form: 'reactivate-form',
		hidden: true,
		title: 'Reactivate'
	},
	size: 'md',
	submit: { colorPalette: 'primary', form: 'submit-form', hidden: false, title: 'Submit' },
	title: ''
}

const useModalStore = create<UseButtonProps & ModalContent>((set, get) => ({
	...initial,
	content: <></>,
	getTitle: () => get().title,
	reset: () => set(initial),
	setActivate: (props) => set((state) => ({ activate: { ...state.activate, ...props } })),
	setAttribute: (key, props) => set((state) => ({ [key]: { ...state[key], ...props } })),
	setBack: (props) => set((state) => ({ back: { ...state.back, ...props } })),
	setCancel: (props) => set((state) => ({ cancel: { ...state.cancel, ...props } })),
	setContent: (props) => set({ content: props }),
	setDeactivate: (props) => set((state) => ({ deactivate: { ...state.deactivate, ...props } })),
	setReactivate: (props) => set((state) => ({ reactivate: { ...state.reactivate, ...props } })),
	setSize: (props) => set({ size: props }),
	setSubmit: (props) => set((state) => ({ submit: { ...state.submit, ...props } })),
	setTitle: (props) => set({ title: props })
}))

export default useModalStore
