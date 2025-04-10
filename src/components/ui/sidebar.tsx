import {
	Accordion,
	Box,
	Button,
	Center,
	For,
	Menu,
	type MenuSelectionDetails,
	Portal,
	Presence,
	Stack,
	Text
} from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import useGetParentId from '@/hooks/use-get-parent-id'
import type { Layout } from '@/types/default'
import useQueryFetched from '../../hooks/use-query-fetched'
import usePreference from '../../stores/preference'
import type {
	GetAllNavigationScreenResponse,
	GetNavigationScreenData,
	GetNavigationScreenResponse
} from '../../types/user/common'
import { GenerateIcon } from '../../utilities/helper'
import Iconify from './iconify'
import Tooltip from './tooltip'

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

	const menu = useMemo(() => {
		return getAllNavigationScreen?.data || []
	}, [getAllNavigationScreen])

	const root = useMemo(() => {
		return getNavigationScreen?.data || []
	}, [getNavigationScreen])

	const width = isOpen ? '64' : '20'

	const handleOnMenuSelect = (selected: MenuSelectionDetails) => {
		const data: GetNavigationScreenData = JSON.parse(selected.value)
		router.push(data.url)
	}

	return (
		<>
			<Stack
				backgroundColor={{ _dark: 'gray.900', _light: 'bg' }}
				height="100vh"
				left={{ base: isOpen ? '0' : '-24', xl: '0' }}
				maxWidth={width}
				minWidth={width}
				position={{ base: 'fixed', xl: 'sticky' }}
				top="0"
				transition="all"
				width={width}
				zIndex="15"
			>
				<Center alignItems="center" gap="2" height="24" maxHeight="24" minHeight="24">
					<Image alt="bot" draggable={false} height={40} src="/logo/compact.svg" width={40} />
					<Image
						alt="bot"
						draggable={false}
						height={80}
						hidden={!isOpen}
						src="/logo/wordmark.svg"
						style={{ height: 80, width: 80 }}
						width={80}
					/>
				</Center>
				<Stack
					alignItems="start"
					height="full"
					overflowX="hidden"
					overflowY="auto"
					padding="4"
					paddingY="2"
					textStyle="sm"
				>
					<Accordion.Root
						display="flex"
						flexDirection="column"
						gap="2"
						size="lg"
						variant="plain"
						collapsible
					>
						<For each={menu}>
							{(item, index) => (
								<Accordion.Item key={index} value={item.title}>
									<Tooltip content={item.title} positioning={{ placement: 'right' }} showArrow>
										<Accordion.ItemTrigger
											_hover={{ bg: 'gray.subtle' }}
											cursor="pointer"
											paddingX="3.5"
											paddingY="3"
											onClick={() => isEmpty(item.items) && router.push(item.url)}
										>
											<GenerateIcon icon={item.image_url} size={20} />
											<Text textStyle="sm" width="full" truncate>
												{item.title}
											</Text>
											<Accordion.ItemIndicator hidden={!isOpen || isEmpty(item.items)} />
										</Accordion.ItemTrigger>
									</Tooltip>
									<Presence present={!isEmpty(item.items)}>
										<Accordion.ItemContent>
											<Accordion.ItemBody>
												<For each={item.items}>
													{(sub, id) => (
														<Tooltip
															key={id}
															content={sub.title}
															positioning={{ placement: 'right' }}
															showArrow
														>
															<Button
																gap="3"
																justifyContent="start"
																paddingY="3"
																variant="ghost"
																width="full"
																onClick={() => router.push(item.url)}
															>
																<GenerateIcon icon={sub.image_url} size={16} />
																<Text textAlign="left" truncate>
																	{sub.title}
																</Text>
															</Button>
														</Tooltip>
													)}
												</For>
											</Accordion.ItemBody>
										</Accordion.ItemContent>
									</Presence>
								</Accordion.Item>
							)}
						</For>
					</Accordion.Root>
					{/* <For each={menu}>
						{(item, index) => (
							<Tooltip
								key={index}
								content={item.title}
								positioning={{ placement: 'right' }}
								showArrow
							>
								<Button
									justifyContent="start"
									paddingX="3"
									paddingY="1"
									variant="ghost"
									width="full"
									onClick={() => router.push(item.url)}
								>
									<GenerateIcon icon={item.image_url} size={20} />
									<Text textAlign="left" truncate>
										{item.title}
									</Text>
								</Button>
							</Tooltip>
						)}
					</For> */}
				</Stack>
				<Center padding="4">
					<Menu.Root onSelect={handleOnMenuSelect}>
						<Menu.Trigger asChild>
							<Button justifyContent="start" size="sm" variant="outline" width="full">
								<Iconify height={20} icon="bxs:grid-alt" />
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
						background="gray.900/60"
						height="100vh"
						hideFrom="xl"
						left="0"
						position="fixed"
						top="0"
						width="100vw"
						zIndex="10"
						onClick={() => setOpen(!isOpen)}
					/>
				</Presence>
			</Portal>
		</>
	)
}

export default Sidebar
