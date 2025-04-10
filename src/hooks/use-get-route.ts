import { usePathname } from 'next/navigation'

type UseGetRouteProps = {
	index?: number
}

const useGetRoute = ({ index }: UseGetRouteProps = {}) => {
	const pathname = usePathname()
	const routes = pathname.split('/').filter((item) => !!item)

	return routes[index ?? routes.length - 1]
}

export default useGetRoute
