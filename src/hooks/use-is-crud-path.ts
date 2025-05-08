import { crud_routes } from '@/utilities/constants'
import useGetCurrentId from './use-get-current-id'

const useIsCRUDPath = () => {
	const current = useGetCurrentId()
	const routes = Object.values(crud_routes)
	const sliced = routes.map((route) => route.slice(1, route.length))

	return current ? sliced.includes(current.toLowerCase()) : false
}

export default useIsCRUDPath
