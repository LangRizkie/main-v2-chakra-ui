import { usePathname } from 'next/navigation'
import { crud_routes } from '@/utilities/constants'

const useIsCustomView = () => {
	const pathname = usePathname()
	return pathname.endsWith(crud_routes.custom_view)
}

export default useIsCustomView
