import useGetParentId from './use-get-parent-id'
import useGetRoute from './use-get-route'
import useIsCRUDPath from './use-is-crud-path'

const useGetCurrentId = () => {
	const screenId = useGetRoute({ index: 1 })
	const parentId = useGetParentId()
	const isCRUDPath = useIsCRUDPath()

	return isCRUDPath ? screenId : parentId
}

export default useGetCurrentId
