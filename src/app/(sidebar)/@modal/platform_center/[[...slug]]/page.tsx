'use client'

import { Case } from 'change-case-all'
import { redirect, RedirectType, usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Static from '@/components/pages/static-page'
import modal from '@/components/ui/modal'
import useCustomViewId from '@/hooks/use-custom-view-id'
import useGetAction from '@/hooks/use-get-action'
import useGetCurrentId from '@/hooks/use-get-current-id'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useQueryFetched from '@/hooks/use-query-fetched'
import useStaticStore from '@/stores/button-static'
import type { GetNavigationScreenResponse } from '@/types/user/common'
import type { GetPrivilegeResponse } from '@/types/user/security-role'

const Page = () => {
	const isCRUDPath = useIsCRUDPath()
	const form = useGetAction()
	const customViewId = useCustomViewId()
	const currentId = useGetCurrentId()
	const pathname = usePathname()

	const { getTitle } = useStaticStore()

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen', customViewId, currentId]
	})

	const getPrivilege = useQueryFetched<GetPrivilegeResponse>({
		queryKey: ['get_privilege', currentId]
	})

	const navigation = useMemo(() => {
		return getNavigationScreen?.data || []
	}, [getNavigationScreen])

	const privilege = useMemo(() => {
		return getPrivilege?.data || []
	}, [getPrivilege])

	const title = form && [Case.capital(form.action), getTitle()].join(' ')

	useEffect(() => {
		if (isCRUDPath && form?.is_modal) {
			modal
				.open('static-modal', {
					children: <Static navigation={navigation} privilege={privilege} />,
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
	}, [isCRUDPath, form, navigation, privilege, title, pathname])

	return <></>
}

export default Page
