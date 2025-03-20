import { Box, Card, For, Grid, Show, Text } from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import useGetRoute from '@/hooks/use-get-route'
import { GetPrivilegeData } from '@/types/user/security-role'
import { GetNavigationScreenData } from '../../types/user/common'
import { GenerateIcon } from '../../utilities/helper'
import Forbidden from './forbidden'

type GridCardProps = {
	navigation: GetNavigationScreenData[]
	privilege: GetPrivilegeData[]
}

const GridCard: React.FC<GridCardProps> = (props) => {
	const router = useRouter()
	const screenId = useGetRoute()

	const privilege = useMemo(() => {
		return props.privilege.find((item) => item.screen_id.toLowerCase() === screenId)
	}, [props.privilege, screenId])

	const canView = useMemo(() => {
		if (!privilege && !isEmpty(props.navigation)) return true
		return privilege ? privilege.can_view : true
	}, [privilege, props.navigation])

	const handleCardClick = (url: string) => {
		router.push(url)
	}

	const handleAnimationDuration = (index: number) => {
		return (index + 1) * 200 + 'ms'
	}

	const handleEmptyDescription = (item: GetNavigationScreenData) => {
		const description = [item.title, 'folder'].join(' ')
		return item.description ? item.description : description
	}

	return (
		<Show when={canView} fallback={<Forbidden />}>
			<Grid
				width="full"
				templateColumns={{
					'2xl': 'repeat(4, 1fr)',
					base: 'repeat(1, 1fr)',
					lg: 'repeat(3, 1fr)',
					md: 'repeat(2, 1fr)'
				}}
				gap="8"
			>
				<For each={props.navigation}>
					{(item, index) => {
						return (
							<Card.Root
								key={index}
								as="button"
								variant="outline"
								cursor="pointer"
								animationName="slide-from-top, fade-in"
								animationDuration={handleAnimationDuration(index)}
								onClick={() => handleCardClick(item.url)}
							>
								<Card.Header alignItems="center" flexDirection="row" gap="4">
									<Box
										borderWidth="thin"
										borderColor="gray.300"
										borderStyle="solid"
										borderRadius="sm"
										padding="2"
									>
										<GenerateIcon
											icon={item.image_url}
											size={28}
											style={{ color: 'var(--chakra-colors-primary-fg)' }}
										/>
									</Box>
									<Text color="primary" fontWeight="bold">
										{item.title}
									</Text>
								</Card.Header>
								<Card.Body>
									<Text color="gray" textStyle="xs" textWrap="pretty">
										{handleEmptyDescription(item)}
									</Text>
								</Card.Body>
								<Card.Footer></Card.Footer>
							</Card.Root>
						)
					}}
				</For>
			</Grid>
		</Show>
	)
}

export default GridCard
