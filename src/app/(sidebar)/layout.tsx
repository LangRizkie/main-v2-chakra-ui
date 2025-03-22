'use client'

import { Flex, IconButton, Stack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Case } from 'change-case-all'
import { isEmpty } from 'lodash'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Breadcrumb from '@/components/ui/breadcrumb'
import Header from '@/components/ui/header'
import Iconify from '@/components/ui/iconify'
import Sidebar from '@/components/ui/sidebar'
import TitleContainer from '@/components/ui/title-container'
import useCustomViewId from '@/hooks/use-custom-view-id'
import { GetPrivilege } from '@/libraries/mutation/user/security-role'
import useStaticStore from '@/stores/button-static'
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
	const customViewId = useCustomViewId()

	const { isSidebarOpen } = usePreference()
	const { setTitle } = useStaticStore()

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
		queryFn: () => GetNavigationScreen({ customViewId, parentId }),
		queryKey: ['get_navigation_screen', customViewId, parentId],
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

	useEffect(() => {
		setTitle(title)
	}, [setTitle, title])

	return (
		<Flex width="full" height="100vh">
			<Sidebar isOpen={isSidebarOpen} />
			<Flex as="main" width="full" flexDirection="column" overflow="hidden">
				<Header />
				<Stack
					gap="6"
					height="full"
					overflowY="auto"
					paddingX={{ base: 2, md: 8 }}
					paddingY={{ base: 2, md: 6 }}
					backgroundColor={{ _light: 'gray.100' }}
				>
					<Stack direction="row" alignItems="center">
						<IconButton size="xs" variant="subtle" onClick={() => history.back()}>
							<Iconify icon="bx:arrow-back" height="14" />
						</IconButton>
						<Breadcrumb
							separator="/"
							gap="2"
							items={breadcrumb}
							fontWeight="semibold"
							hideBelow="md"
						/>
					</Stack>
					<TitleContainer title={title}>{children}</TitleContainer>
				</Stack>
			</Flex>
		</Flex>
	)
}

export default SidebarLayout
