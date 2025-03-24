import { crud_routes } from '@/utilities/constants'
import useGetRoute from './use-get-route'

const useIsCRUDPath = () => {
	const current = useGetRoute()
	const routes = Object.values(crud_routes)
	const sliced = routes.map((route) => route.slice(1, route.length))

	return sliced.includes(current)
}

export default useIsCRUDPath
