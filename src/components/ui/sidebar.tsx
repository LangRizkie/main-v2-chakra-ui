import {
	Box,
	Button,
	Center,
	For,
	Menu,
	MenuSelectionDetails,
	Portal,
	Presence,
	Stack,
	Text
} from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import useGetParentId from '@/hooks/use-get-parent-id'
import { Layout } from '@/types/default'
import useQueryFetched from '../../hooks/use-query-fetched'
import usePreference from '../../stores/preference'
import {
	GetAllNavigationScreenResponse,
	GetNavigationScreenData,
	GetNavigationScreenResponse
} from '../../types/user/common'
import { GenerateIcon } from '../../utilities/helper'
import Iconify from './iconify'

type SidebarProps = Layout & {
	isOpen?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
	const router = useRouter()
	const parentId = useGetParentId()

	const { setOpen } = usePreference()

	const getAllNavigationScreen = useQueryFetched<GetAllNavigationScreenResponse>({
		queryKey: ['get_all_navigation_screen', parentId]
	})

	const getNavigationScreen = useQueryFetched<GetNavigationScreenResponse>({
		queryKey: ['get_navigation_screen']
	})

	const width = isOpen ? '64' : '20'
	const justifyContent = isOpen ? 'start' : 'center'

	const menu = useMemo(() => {
		return (getAllNavigationScreen && getAllNavigationScreen.data) || []
	}, [getAllNavigationScreen])

	const root = useMemo(() => {
		return (getNavigationScreen && getNavigationScreen.data) || []
	}, [getNavigationScreen])

	const handleOnMenuSelect = (selected: MenuSelectionDetails) => {
		const data: GetNavigationScreenData = JSON.parse(selected.value)
		router.push(data.url)
	}

	return (
		<>
			<Stack
				top="0"
				width={width}
				height="100vh"
				position={{ base: 'fixed', xl: 'sticky' }}
				left={{ base: isOpen ? '0' : '-24', xl: '0' }}
				backgroundColor={{ _dark: 'gray.900', _light: 'bg' }}
				transition="all"
				zIndex="15"
			>
				<Center height="24" minHeight="24" maxHeight="24" alignItems="center" gap="2">
					<Image src="/logo/compact.svg" alt="bot" width={40} height={40} draggable={false} />
					<Image
						hidden={!isOpen}
						src="/logo/wordmark.svg"
						alt="bot"
						width={80}
						height={80}
						draggable={false}
						style={{ height: 80, width: 80 }}
					/>
				</Center>
				<Stack
					textStyle="sm"
					padding="4"
					paddingY="2"
					height="full"
					overflowY="auto"
					overflowX="hidden"
					alignItems="start"
				>
					<For each={menu}>
						{(item, index) => (
							<Button
								key={index}
								width="full"
								variant="ghost"
								justifyContent={justifyContent}
								onClick={() => router.push(item.url)}
							>
								<GenerateIcon icon={item.image_url} size={20} />
								<Text textWrap="pretty" textAlign="left" hidden={!isOpen}>
									{item.title}
								</Text>
							</Button>
						)}
					</For>
				</Stack>
				<Center padding="4">
					<Menu.Root onSelect={handleOnMenuSelect}>
						<Menu.Trigger asChild>
							<Button justifyContent="start" variant="outline" width="full" size="sm">
								<Iconify icon="bxs:grid-alt" height={20} />
								<Text hidden={!isOpen}>Menu</Text>
							</Button>
						</Menu.Trigger>
						<Portal>
							<Menu.Positioner>
								<Menu.Content>
									<For each={root}>
										{(item, index) => (
											<Menu.Item key={index} value={JSON.stringify(item)}>
												<GenerateIcon icon={item.image_url} />
												{item.title}
											</Menu.Item>
										)}
									</For>
								</Menu.Content>
							</Menu.Positioner>
						</Portal>
					</Menu.Root>
				</Center>
			</Stack>
			<Portal>
				<Presence present={isOpen}>
					<Box
						hideFrom="xl"
						position="fixed"
						top="0"
						left="0"
						width="100vw"
						height="100vh"
						background="gray.900/60"
						zIndex="10"
						onClick={() => setOpen(!isOpen)}
					/>
				</Presence>
			</Portal>
		</>
	)
}

export default Sidebar
