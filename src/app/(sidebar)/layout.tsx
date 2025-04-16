'use client'

import { Layout } from '@regla/monorepo'
import { useQuery } from '@tanstack/react-query'
import { Case } from 'change-case-all'
import { isEmpty } from 'lodash'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import Header from '@/components/ui/header'
import { SidebarContent, SidebarMenu } from '@/components/ui/sidebar'
import useCustomViewId from '@/hooks/use-custom-view-id'
import useGetAction from '@/hooks/use-get-action'
import useGetCurrentId from '@/hooks/use-get-current-id'
import useGetRoute from '@/hooks/use-get-route'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import { GetAllNavigationScreen, GetNavigationScreen } from '@/libraries/mutation/user/common'
import { GetPathUrlScreen } from '@/libraries/mutation/user/screen'
import { GetPrivilege } from '@/libraries/mutation/user/security-role'
import useStaticStore from '@/stores/button-static'
import usePreference from '@/stores/preference'
import type { LayoutType } from '../../types/default'

const SidebarLayout: React.FC<LayoutType> = ({ children, modal }) => {
	const route = useGetRoute()
	const pathname = usePathname()
	const customViewId = useCustomViewId()
	const currentId = useGetCurrentId()
	const action = useGetAction()
	const isCRUDPath = useIsCRUDPath()

	const { isSidebarOpen, setOpen } = usePreference()
	const { activate, back, deactivate, reactivate, submit } = useStaticStore()

	// Breadcrumb and title
	const { data } = useQuery({
		queryFn: () => GetPathUrlScreen({ screenId: currentId ?? route }),
		queryKey: ['get_path_url_screen', currentId, route],
		refetchOnWindowFocus: false
	})

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

		return title ?? Case.capital(route)
	}, [action, breadcrumb, isCRUDPath, route])

	return (
		<Layout
			breadcrumb={breadcrumb}
			container={{ activate, back, deactivate, reactivate, submit, title }}
			modal={modal}
			header={{
				content: <Header />,
				onSymbolClick: () => setOpen(!isSidebarOpen)
			}}
			sidebar={{
				content: <SidebarContent />,
				footer: <SidebarMenu />,
				isOpen: isSidebarOpen
			}}
		>
			{children}
		</Layout>
	)
}

export default SidebarLayout
