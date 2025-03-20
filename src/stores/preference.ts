import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PreferenceData = {
	isDarkMode: boolean
	isSidebarOpen: boolean
}

type ThemeProps = 'light' | 'dark'

type UsePreferenceProps = Partial<PreferenceData> & {
	setOpen: (value: boolean) => void
	setTheme: (value: ThemeProps) => void
	reset: () => void
}

const initial: Partial<PreferenceData> = {
	isDarkMode: false,
	isSidebarOpen: false
}

const usePreference = create<UsePreferenceProps>()(
	persist(
		(set) => ({
			...initial,
			reset: () => set(initial),
			setOpen: (value: boolean) => set({ isSidebarOpen: value }),
			setTheme: (value: ThemeProps) => set({ isDarkMode: value === 'dark' })
		}),
		{ name: 'preference' }
	)
)

export default usePreference
