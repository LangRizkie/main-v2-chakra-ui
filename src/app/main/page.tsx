'use client'

import {
	Box,
	Card,
	Center,
	Flex,
	For,
	Grid,
	IconButton,
	Skeleton,
	Stack,
	Text
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import Iconify from '../../components/ui/iconify'
import Tooltip from '../../components/ui/tooltip'
import { logout } from '../../config/instance'
import { GetPlatform } from '../../libraries/mutation/platform-settings/master-application'
import { GenerateIcon } from '../../utilities/helper'

const Page = () => {
	const router = useRouter()

	const { data, isPending } = useQuery({
		queryFn: GetPlatform,
		queryKey: ['get_platform']
	})

	const menu = useMemo(() => {
		return (data && data.data) || []
	}, [data])

	const handleCardClick = (url: string) => {
		router.push(url)
	}

	return (
		<Center padding="16" minHeight="100vh" flexDirection="column" gap="16">
			<Flex
				width="full"
				flexDirection={{ base: 'column', lg: 'row' }}
				alignItems="center"
				justifyContent="space-between"
				gap="12"
			>
				<Stack gap="4">
					<Text
						color="gray"
						textStyle="3xl"
						fontWeight="bold"
						textAlign={{ base: 'center', lg: 'left' }}
					>
						Welcome To Regla Platform
					</Text>
					<Text
						color="gray"
						textStyle="lg"
						maxWidth="breakpoint-md"
						textWrap="pretty"
						textAlign={{ base: 'center', lg: 'left' }}
					>
						Regla platform is a robust solution that leverages advanced technologies to
						streamline regulatory processes, improve data accuracy, and minimize compliance
						costs.
					</Text>
				</Stack>
				<Flex alignItems="center" gap="6">
					<Tooltip content="Chatbot AI" showArrow>
						<IconButton colorPalette="gray" variant="surface" rounded="full">
							<Image src="/bam.svg" alt="bot" width={20} height={20} draggable={false} />
						</IconButton>
					</Tooltip>
					<Tooltip content="Notification" showArrow>
						<IconButton variant="ghost" rounded="full">
							<Iconify icon="bxs:bell" height={20} />
						</IconButton>
					</Tooltip>
					<Tooltip content="Logout" showArrow>
						<IconButton variant="ghost" rounded="full" onClick={logout}>
							<Iconify icon="bx:log-out" height={20} />
						</IconButton>
					</Tooltip>
					<Image
						src="/logo/full.svg"
						alt="logo"
						width={192}
						height={192}
						style={{ height: 'auto', width: 'auto' }}
						draggable={false}
						priority
					/>
				</Flex>
			</Flex>
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
				<For each={Array.from(Array(8))}>
					{(item, index) => (
						<Skeleton key={index} width="full" minHeight={48} hidden={!isPending}>
							{item}
						</Skeleton>
					)}
				</For>
				<For each={menu}>
					{(item, index) => {
						const variant = item.is_active_menu ? 'outline' : 'subtle'
						const cursor = item.is_active_menu ? 'pointer' : 'default'
						const filter = item.is_active_menu ? '' : 'grayscale(80%)'
						const color = item.is_active_menu ? 'primary.fg' : 'gray'

						return (
							<Card.Root
								variant={variant}
								key={index}
								cursor={cursor}
								onClick={() => item.is_active_menu && handleCardClick(item.url)}
								hidden={isPending}
							>
								<Card.Header alignItems="center" flexDirection="row" gap="4">
									<Box
										borderWidth="thin"
										borderColor="gray.300"
										borderStyle="solid"
										borderRadius="sm"
										padding="2"
										filter={filter}
									>
										<GenerateIcon
											icon={item.image_url}
											size={28}
											style={{ color: 'var(--chakra-colors-primary-fg)' }}
										/>
									</Box>
									<Text color={color} fontWeight="semibold">
										{item.applicationName}
									</Text>
								</Card.Header>
								<Card.Body>
									<Text color="gray" textStyle="xs" textWrap="pretty">
										{item.description}
									</Text>
								</Card.Body>
							</Card.Root>
						)
					}}
				</For>
			</Grid>
		</Center>
	)
}

export default Page
