import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PreferenceData = {
	isSidebarOpen: boolean
}

type UsePreferenceProps = Partial<PreferenceData> & {
	setOpen: (value: boolean) => void
	reset: () => void
}

const initial: Partial<PreferenceData> = {
	isSidebarOpen: false
}

const usePreference = create<UsePreferenceProps>()(
	persist(
		(set) => ({
			...initial,
			reset: () => set(initial),
			setOpen: (value: boolean) => set({ isSidebarOpen: value })
		}),
		{ name: 'preference' }
	)
)

export default usePreference
