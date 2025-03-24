import { ButtonProps } from '@chakra-ui/react'
import { create } from 'zustand'
import { ButtonData, ButtonKeys, UseButtonProps } from '@/types/default'

type StaticContent = {
	title?: string
	getTitle: () => string | undefined
	setTitle: (value: string) => void
	setAttribute: (key: ButtonKeys, props: ButtonProps) => void
}

const getInitialState = (): Partial<ButtonData & StaticContent> => ({
	activate: { colorPalette: 'teal', form: 'activate-form', hidden: true, title: 'Activate' },
	back: { hidden: true, title: 'Back', variant: 'subtle' },
	cancel: { hidden: true, title: 'Cancel', variant: 'subtle' },
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
	submit: { colorPalette: 'primary', form: 'submit-form', hidden: true, title: 'Save' },
	title: ''
})

const useStaticStore = create<UseButtonProps & StaticContent>((set, get) => ({
	...getInitialState(),
	getTitle: () => get().title,
	reset: () => set(() => getInitialState()),
	setActivate: (props) => set((state) => ({ activate: { ...state.activate, ...props } })),
	setAttribute: (key, props) => set((state) => ({ [key]: { ...state[key], ...props } })),
	setBack: (props) => set((state) => ({ back: { ...state.back, ...props } })),
	setCancel: (props) => set((state) => ({ cancel: { ...state.cancel, ...props } })),
	setDeactivate: (props) => set((state) => ({ deactivate: { ...state.deactivate, ...props } })),
	setReactivate: (props) => set((state) => ({ reactivate: { ...state.reactivate, ...props } })),
	setSubmit: (props) => set((state) => ({ submit: { ...state.submit, ...props } })),
	setTitle: (props) => set({ title: props })
}))

export default useStaticStore
