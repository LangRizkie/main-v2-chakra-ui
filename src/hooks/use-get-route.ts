import { usePathname } from 'next/navigation'

type UseGetRouteProps = {
	index?: number
	fromLast?: boolean
}

const useGetRoute = ({ fromLast = false, index }: UseGetRouteProps = {}) => {
	const pathname = usePathname()
	const routes = pathname.split('/').filter((item) => !!item)

	return routes[index && fromLast ? routes.length - index : (index ?? routes.length - 1)]
}

export default useGetRoute
