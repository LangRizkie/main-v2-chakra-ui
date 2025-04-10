'use client'

import { Flex, HStack, IconButton, Stack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Case } from 'change-case-all'
import { isEmpty } from 'lodash'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import Breadcrumb from '@/components/ui/breadcrumb'
import Header from '@/components/ui/header'
import Iconify from '@/components/ui/iconify'
import Sidebar from '@/components/ui/sidebar'
import TitleContainer from '@/components/ui/title-container'
import useCustomViewId from '@/hooks/use-custom-view-id'
import useGetAction from '@/hooks/use-get-action'
import useGetCurrentId from '@/hooks/use-get-current-id'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import { GetPrivilege } from '@/libraries/mutation/user/security-role'
import useGetRoute from '../../hooks/use-get-route'
import {
	GetAllNavigationScreen,
	GetNavigationScreen
} from '../../libraries/mutation/user/common'
import { GetPathUrlScreen } from '../../libraries/mutation/user/screen'
import usePreference from '../../stores/preference'
import type { Layout } from '../../types/default'

const SidebarLayout: React.FC<Layout> = ({ children, modal }) => {
	const route = useGetRoute()
	const pathname = usePathname()
	const customViewId = useCustomViewId()
	const currentId = useGetCurrentId()
	const action = useGetAction()
	const isCRUDPath = useIsCRUDPath()

	const { isSidebarOpen } = usePreference()

	// Sidebar Menu
	useQuery({
		queryFn: () => GetAllNavigationScreen({ parentId: currentId }),
		queryKey: ['get_all_navigation_screen', currentId],
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
		queryFn: () => GetNavigationScreen({ customViewId, parentId: currentId }),
		queryKey: ['get_navigation_screen', customViewId, currentId],
		refetchOnWindowFocus: false
	})

	// User Privilege
	useQuery({
		queryFn: () => GetPrivilege({ screenId: currentId }),
		queryKey: ['get_privilege', currentId],
		refetchOnWindowFocus: false
	})

	// Breadcrumb and title
	const { data } = useQuery({
		queryFn: () => GetPathUrlScreen({ screenId: currentId ?? route }),
		queryKey: ['get_path_url_screen', currentId, route],
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
		const title = breadcrumb[breadcrumb.length - 1].title
		if (isCRUDPath && action && !action.is_modal) return [Case.capital(route), title].join(' ')
		return title
	}, [action, breadcrumb, isCRUDPath, route])

	return (
		<Flex height="100vh" width="full">
			<Sidebar isOpen={isSidebarOpen} />
			<Flex as="main" flexDirection="column" overflow="hidden" width="full">
				<Header />
				<Stack
					backgroundColor={{ _light: 'gray.100' }}
					gap="6"
					height="full"
					overflowY="auto"
					paddingX={{ base: 4, md: 8 }}
					paddingY={{ base: 4, md: 6 }}
				>
					<HStack alignItems="center">
						<IconButton size="xs" variant="subtle" onClick={() => history.back()}>
							<Iconify height="14" icon="bx:arrow-back" />
						</IconButton>
						<Breadcrumb
							fontWeight="semibold"
							gap="2"
							hideBelow="md"
							items={breadcrumb}
							separator="/"
						/>
					</HStack>
					<TitleContainer title={title}>{children}</TitleContainer>
				</Stack>
			</Flex>
			{modal}
		</Flex>
	)
}

export default SidebarLayout
