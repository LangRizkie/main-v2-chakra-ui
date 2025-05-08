import { useMemo } from 'react'
import type {
	GetNavigationScreenAction,
	GetNavigationScreenResponse
} from '@/types/user/common'
import useCustomViewId from './use-custom-view-id'
import useGetCurrentId from './use-get-current-id'
import useGetParentId from './use-get-parent-id'
import useQueryFetched from './use-query-fetched'

const useGetAction = (action?: GetNavigationScreenAction) => {
	const customViewId = useCustomViewId()
	const parentId = useGetParentId()
	const currentId = useGetCurrentId()

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen', customViewId, currentId]
	})

	const form = useMemo(() => {
		if (getNavigationScreen?.data) {
			const map = getNavigationScreen.data.map((item) => {
				if (item.dynamic_form) {
					return item.dynamic_form.find((form) => {
						const parent = parentId ? parentId.toLowerCase() : ''
						const act = action ? action.toLowerCase() : parent

						return form.action.toLowerCase() === act
					})
				}
			})

			return map?.[0] ?? undefined
		}

		return undefined
	}, [action, parentId, getNavigationScreen])

	return form
}

export default useGetAction
