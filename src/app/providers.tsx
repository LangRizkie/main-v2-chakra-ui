'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import Notification from '@/components/ui/notification'
import { system } from '@/config/theme'
import { Layout } from '@/types/default'

const queryClient = new QueryClient()

const Providers: React.FC<Layout> = ({ children }) => {
	return (
		<ChakraProvider value={system}>
			<ThemeProvider attribute="class">
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools initialIsOpen={false} />
					<Notification />
					{children}
				</QueryClientProvider>
			</ThemeProvider>
		</ChakraProvider>
	)
}

export default Providers
