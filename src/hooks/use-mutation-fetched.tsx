import { useMutationState } from '@tanstack/react-query'

type usMutationFetchedProps = {
	mutationKey: unknown[]
}

const useMutationFetched = <T,>({ mutationKey }: usMutationFetchedProps) => {
	const data = useMutationState({
		filters: { mutationKey },
		select: (mutation) => mutation.state.data
	})

	return data && data[0] ? (data[0] as T) : undefined
}

export default useMutationFetched
