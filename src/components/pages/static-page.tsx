import { Card, Show } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useEffect, useMemo } from 'react'
import useGetRoute from '@/hooks/use-get-route'
import useButton from '@/stores/button-static'
import { GetNavigationScreenData } from '@/types/user/common'
import { GetPrivilegeData } from '@/types/user/security-role'
import { messages } from '@/utilities/validation'
import Forbidden from './forbidden'

type StaticProps = {
	navigation: GetNavigationScreenData[]
	privilege: GetPrivilegeData[]
	screenId: string
}

const ErrorComponent = () => <>{messages.component_not_found}</>

const Static: React.FC<StaticProps> = (props) => {
	const screenId = useGetRoute()
	const { reset, setBack, setSubmit } = useButton()

	const Component = dynamic<StaticProps>(
		() => import(`./${props.screenId}/page.tsx`).catch(() => ErrorComponent),
		{ ssr: false }
	)

	const privilege = useMemo(() => {
		return props.privilege.find((item) => item.screen_id.toLowerCase() === screenId)
	}, [props.privilege, screenId])

	const canInsert = useMemo(() => {
		return privilege ? privilege.can_insert : false
	}, [privilege])

	const canUpdate = useMemo(() => {
		return privilege ? privilege.can_update : false
	}, [privilege])

	const canSubmit = useMemo(() => {
		return canInsert || canUpdate
	}, [canInsert, canUpdate])

	const canView = useMemo(() => {
		return privilege ? privilege.can_view : false
	}, [privilege])

	const canInteractWithSubmit = useMemo(() => {
		return canSubmit && canView
	}, [canSubmit, canView])

	useEffect(() => {
		setBack({ hidden: false })
		setSubmit({ hidden: !canInteractWithSubmit })

		return () => reset()
	}, [setBack, setSubmit, reset, canInteractWithSubmit])

	return (
		<Show when={canView} fallback={<Forbidden />}>
			<Card.Root
				width="full"
				size="sm"
				animationName="slide-from-top, fade-in"
				animationDuration="200ms"
			>
				<Card.Header></Card.Header>
				<Card.Body paddingX="8">
					<Component {...props} />
				</Card.Body>
				<Card.Footer></Card.Footer>
			</Card.Root>
		</Show>
	)
}

export default Static
