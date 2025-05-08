'use client'

import { useIsFetching } from '@tanstack/react-query'
import { Case } from 'change-case-all'
import { redirect, RedirectType, usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import StaticPage from '@/components/pages/static-page'
import modal from '@/components/ui/modal'
import useCustomViewId from '@/hooks/use-custom-view-id'
import useGetAction from '@/hooks/use-get-action'
import useGetCurrentId from '@/hooks/use-get-current-id'
import useGetRoute from '@/hooks/use-get-route'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useQueryFetched from '@/hooks/use-query-fetched'
import type { GetNavigationScreenResponse } from '@/types/user/common'
import { GetPathUrlScreenResponse } from '@/types/user/screen'
import type { GetPrivilegeResponse } from '@/types/user/security-role'

const Page = () => {
	const route = useGetRoute()
	const isCRUDPath = useIsCRUDPath()
	const form = useGetAction()
	const customViewId = useCustomViewId()
	const currentId = useGetCurrentId()
	const pathname = usePathname()

	useIsFetching({
		queryKey: ['get_navigation_screen', customViewId, currentId]
	})

	const getPathUrlScreen = useQueryFetched<GetPathUrlScreenResponse>({
		queryKey: ['get_path_url_screen', currentId, route]
	})

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen', customViewId, currentId]
	})

	const getPrivilege = useQueryFetched<GetPrivilegeResponse>({
		queryKey: ['get_privilege', currentId]
	})

	const title = useMemo(() => {
		if (getPathUrlScreen?.data) {
			const path = getPathUrlScreen.data.flatMap((item) => item.path.split('/'))
			return form ? [Case.capital(form.action), path[path.length - 1]].join(' ') : ''
		}

		return ''
	}, [form, getPathUrlScreen?.data])

	const navigation = useMemo(() => {
		return getNavigationScreen?.data || []
	}, [getNavigationScreen])

	const privilege = useMemo(() => {
		return getPrivilege?.data || []
	}, [getPrivilege])

	useEffect(() => {
		if (navigation && isCRUDPath && form?.is_modal) {
			modal
				.open('static-modal', {
					children: <StaticPage navigation={navigation} privilege={privilege} />,
					title
				})
				.then(() => {
					if (isCRUDPath) {
						const parent = pathname.slice(0, pathname.lastIndexOf('/'))
						const isOrigin = document.referrer.startsWith(origin)

						if (isOrigin) return history.back()
						return redirect(parent, RedirectType.push)
					}
				})
		}
	}, [form?.is_modal, isCRUDPath, navigation, pathname, privilege, title])

	return <></>
}

export default Page
