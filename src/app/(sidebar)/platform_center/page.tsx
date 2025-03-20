'use client'

import { useIsFetching } from '@tanstack/react-query'
import { useMemo } from 'react'
import GridCard from '@/components/pages/grid-card'
import useGetParentId from '@/hooks/use-get-parent-id'
import useGetRoute from '@/hooks/use-get-route'
import useQueryFetched from '@/hooks/use-query-fetched'
import { GetNavigationScreenResponse } from '@/types/user/common'
import { GetPrivilegeResponse } from '@/types/user/security-role'

const Page = () => {
	const parentId = useGetParentId()
	const screenId = useGetRoute()

	useIsFetching({ queryKey: ['get_navigation_screen', parentId] })

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen', parentId]
	})

	const getPrivilege = useQueryFetched<GetPrivilegeResponse>({
		queryKey: ['get_privilege', screenId]
	})

	const navigation = useMemo(() => {
		return (getNavigationScreen && getNavigationScreen.data) || []
	}, [getNavigationScreen])

	const privilege = useMemo(() => {
		return (getPrivilege && getPrivilege.data) || []
	}, [getPrivilege])

	return <GridCard navigation={navigation} privilege={privilege} />
}

export default Page
