import useGetCurrentId from './use-get-current-id'
import useGetParentId from './use-get-parent-id'
import useIsCRUDPath from './use-is-crud-path'

// NOTES: this hook will get current last path with conditional route

const useGetDynamicId = () => {
	const isCRUDPath = useIsCRUDPath()
	const parentId = useGetParentId()
	const currentId = useGetCurrentId()

	return isCRUDPath ? parentId : currentId
}

export default useGetDynamicId
