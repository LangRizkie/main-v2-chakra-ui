import { Case } from 'change-case-all'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

const useGetParentId = () => {
	const { slug } = useParams()

	const current = useMemo(() => {
		if (slug) return slug[slug.length - 1]
		return ''
	}, [slug])

	const parentId = useMemo(() => {
		return current ? Case.upper(current) : ''
	}, [current])

	return parentId
}

export default useGetParentId
