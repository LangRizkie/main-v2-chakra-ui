import { Card, Center, Show, Spinner, Stack } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useEffect, useMemo } from 'react'
import useGetCurrentId from '@/hooks/use-get-current-id'
import useGetRoute from '@/hooks/use-get-route'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import useIsCustomView from '@/hooks/use-is-custom-view'
import useStaticStore from '@/stores/button-static'
import type { GetNavigationScreenData } from '@/types/user/common'
import type { GetPrivilegeData } from '@/types/user/security-role'
import { messages } from '@/utilities/validation'
import Forbidden from './forbidden'

type StaticProps = {
	navigation: GetNavigationScreenData[]
	privilege: GetPrivilegeData[]
	isCard?: boolean
	isException?: boolean
}

const ErrorComponent = () => <>{messages.component_not_found}</>

const LoadingComponent = () => (
	<Center marginY="2">
		<Spinner size="lg" />
	</Center>
)

const Static: React.FC<StaticProps> = (props) => {
	const route = useGetRoute()
	const screenId = useGetCurrentId()
	const isCRUDPath = useIsCRUDPath()
	const isCustomView = useIsCustomView()

	const crud = screenId + '/' + route
	const normal = screenId?.toLowerCase()

	const routes = `./${isCRUDPath && !isCustomView ? crud : normal}/page.tsx`

	const { card, reset, setBack, setSubmit } = useStaticStore()

	const Component = useMemo(
		() =>
			dynamic<StaticProps>(() => import(routes).catch(() => ErrorComponent), {
				loading: LoadingComponent,
				ssr: false
			}),
		[routes]
	)

	const privilege = useMemo(() => {
		return props.privilege.find(
			(item) => item.screen_id.toLowerCase() === screenId?.toLowerCase()
		)
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
		return privilege ? privilege.can_view : (props.isException ?? false)
	}, [privilege, props.isException])

	const canInteractWithSubmit = useMemo(() => {
		return canSubmit && canView && props.isCard
	}, [canSubmit, canView, props.isCard])

	useEffect(() => {
		setBack({ hidden: !props.isCard })
		setSubmit({ hidden: !canInteractWithSubmit })

		return () => reset()
	}, [setBack, setSubmit, reset, canInteractWithSubmit, props.isCard])

	return (
		<Show fallback={<Forbidden />} when={canView}>
			<Show when={props.isCard}>
				<Card.Root {...card} hidden={card?.normalize || card?.hidden}>
					<Card.Header />
					<Card.Body paddingX="8">
						<Component {...props} />
					</Card.Body>
					<Card.Footer />
				</Card.Root>
				<Stack hidden={!card?.normalize}>
					<Component {...props} />
				</Stack>
			</Show>
			<Show when={!props.isCard}>
				<Component {...props} />
			</Show>
		</Show>
	)
}

export default Static
