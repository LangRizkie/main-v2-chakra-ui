'use client'

import { useIsFetching } from '@tanstack/react-query'
import { useMemo } from 'react'
import DataTable from '@/components/pages/data-table'
import GridCard from '@/components/pages/grid-card'
import Static from '@/components/pages/static-page'
import useGetParentId from '@/hooks/use-get-parent-id'
import useGetRoute from '@/hooks/use-get-route'
import useQueryFetched from '@/hooks/use-query-fetched'
import { GetNavigationScreenResponse } from '@/types/user/common'
import { GetPrivilegeResponse } from '@/types/user/security-role'

const Page = () => {
	const screenId = useGetRoute()
	const parentId = useGetParentId()

	useIsFetching({ queryKey: ['get_navigation_screen', parentId] })
	useIsFetching({ queryKey: ['get_privilege', screenId] })

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

	const isTable = useMemo(() => {
		return navigation.some((item) => item.is_table)
	}, [navigation])

	const isStatic = useMemo(() => {
		return navigation.some((item) => isTable && item.form_type === 'STATIC')
	}, [isTable, navigation])

	if (isStatic)
		return <Static screenId={screenId} navigation={navigation} privilege={privilege} />

	if (isTable) return <DataTable navigation={navigation} privilege={privilege} />

	return <GridCard navigation={navigation} privilege={privilege} />
}

export default Page
