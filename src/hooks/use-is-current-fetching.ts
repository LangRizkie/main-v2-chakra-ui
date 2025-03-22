import { useQueryClient } from '@tanstack/react-query'

const useIsCurrentFetching = () => {
	const queryClient = useQueryClient()
	return queryClient.isFetching() > 0
}

export default useIsCurrentFetching
