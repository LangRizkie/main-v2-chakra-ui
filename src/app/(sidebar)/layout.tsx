'use client'

import { Flex, Stack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Case } from 'change-case-all'
import { isEmpty } from 'lodash'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { GetPrivilege } from '@/libraries/mutation/user/security-role'
import Breadcrumb from '../../components/ui/breadcrumb'
import Header from '../../components/ui/header'
import Sidebar from '../../components/ui/sidebar'
import TitleContainer from '../../components/ui/title-container'
import useGetParentId from '../../hooks/use-get-parent-id'
import useGetRoute from '../../hooks/use-get-route'
import {
	GetAllNavigationScreen,
	GetNavigationScreen
} from '../../libraries/mutation/user/common'
import { GetPathUrlScreen } from '../../libraries/mutation/user/screen'
import usePreference from '../../stores/preference'
import { Layout } from '../../types/default'

const SidebarLayout: React.FC<Layout> = ({ children }) => {
	const route = useGetRoute()
	const pathname = usePathname()
	const parentId = useGetParentId()

	const { isSidebarOpen } = usePreference()

	// Sidebar Menu
	useQuery({
		queryFn: () => GetAllNavigationScreen({ parentId }),
		queryKey: ['get_all_navigation_screen', parentId],
		refetchOnWindowFocus: false
	})

	// Sidebar Bottom Menu
	useQuery({
		queryFn: () => GetNavigationScreen(),
		queryKey: ['get_navigation_screen'],
		refetchOnWindowFocus: false
	})

	// Dynamic menu
	useQuery({
		queryFn: () => GetNavigationScreen({ customViewId: '', parentId }),
		queryKey: ['get_navigation_screen', parentId],
		refetchOnWindowFocus: false
	})

	// User Privilege
	useQuery({
		queryFn: () => GetPrivilege({ screenId: route }),
		queryKey: ['get_privilege', route],
		refetchOnWindowFocus: false
	})

	// Breadcrumb and title
	const { data } = useQuery({
		queryFn: () => GetPathUrlScreen({ screenId: Case.upper(route) }),
		queryKey: ['get_path_url_screen', route],
		refetchOnWindowFocus: false
	})

	const breadcrumb = useMemo(() => {
		if (isEmpty(data) || (data && isEmpty(data.data)))
			return [{ title: Case.capital(route), url: pathname }]

		const crumb = data.data[0]
		const path = crumb.path.split('/').filter((item) => !!item)
		const url = crumb.url.split('/').filter((item) => !!item)

		return path.map((p, i) => ({
			title: p,
			url: '/' + url.slice(0, i + 1).join('/')
		}))
	}, [data, pathname, route])

	const title = useMemo(() => {
		return breadcrumb[breadcrumb.length - 1].title
	}, [breadcrumb])

	return (
		<Flex minHeight="100vh">
			<Sidebar isOpen={isSidebarOpen} />
			<Flex flexDirection="column" width="full">
				<Header />
				<Stack
					height="full"
					paddingX={{ base: 2, md: 8 }}
					paddingY={{ base: 2, md: 6 }}
					backgroundColor={{ _light: 'gray.100' }}
					gap="6"
				>
					<Breadcrumb
						separator="/"
						gap="2"
						items={breadcrumb}
						fontWeight="semibold"
						hideBelow="md"
					/>
					<TitleContainer title={title}>{children}</TitleContainer>
				</Stack>
			</Flex>
		</Flex>
	)
}

export default SidebarLayout
