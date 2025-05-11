'use client'

import {
	Box,
	Card,
	Center,
	Flex,
	For,
	Grid,
	Heading,
	IconButton,
	Link,
	Show,
	Skeleton,
	Stack,
	Text
} from '@chakra-ui/react'
import { Iconify, Tooltip } from '@regla/monorepo'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useMemo } from 'react'
import { GetPlatform } from '@/libraries/mutation/user/application'
import { routes } from '@/utilities/constants'
import { logout } from '../../config/instance'
import { GenerateIcon } from '../../utilities/helper'

const Page = () => {
	const { data, isPending } = useQuery({
		queryFn: GetPlatform,
		queryKey: ['get_platform']
	})

	const menu = useMemo(() => {
		return data?.data || []
	}, [data])

	const notification = useMemo(() => {
		return `/platform_center${routes.exception.notification}`
	}, [])

	const handleAnimationDuration = (index: number) => {
		return (index + 1) * 200 + 'ms'
	}

	return (
		<Center
			backgroundImage="url('/antenna.svg')"
			backgroundPosition="bottom right"
			backgroundRepeat="no-repeat"
			backgroundSize="24rem"
			flexDirection="column"
			gap="16"
			minHeight="dvh"
			padding="16"
		>
			<Flex
				alignItems="center"
				flexDirection={{ base: 'column', lg: 'row' }}
				gap="12"
				justifyContent="space-between"
				width="full"
			>
				<Stack gap="4">
					<Heading
						color="gray"
						fontWeight="semibold"
						size="3xl"
						textAlign={{ base: 'center', lg: 'left' }}
					>
						Welcome To Regla Platform
					</Heading>
					<Text
						color="gray"
						maxWidth="breakpoint-md"
						textAlign={{ base: 'center', lg: 'left' }}
						textStyle="lg"
						textWrap="pretty"
					>
						Regla platform is a robust solution that leverages advanced technologies to
						streamline regulatory processes, improve data accuracy, and minimize compliance
						costs.
					</Text>
				</Stack>
				<Flex alignItems="center" gap="6">
					<Tooltip content="Bam AI" showArrow>
						<IconButton colorPalette="gray" rounded="full" variant="surface">
							<Image alt="bot" draggable={false} height={20} src="/bam.svg" width={20} />
						</IconButton>
					</Tooltip>
					<Tooltip content="Notification" showArrow>
						<Link href={notification}>
							<IconButton rounded="full" variant="ghost">
								<Iconify height={20} icon="bxs:bell" />
							</IconButton>
						</Link>
					</Tooltip>
					<Tooltip content="Logout" showArrow>
						<IconButton rounded="full" variant="ghost" onClick={logout}>
							<Iconify height={20} icon="bx:log-out" />
						</IconButton>
					</Tooltip>
					<Image
						alt="logo"
						draggable={false}
						height={192}
						src="/logo/full.svg"
						style={{ height: 'auto', width: 'auto' }}
						width={192}
						priority
					/>
				</Flex>
			</Flex>
			<Grid
				autoRows="1fr"
				gap="8"
				width="full"
				templateColumns={{
					'2xl': 'repeat(4, 1fr)',
					base: 'repeat(1, 1fr)',
					lg: 'repeat(3, 1fr)',
					md: 'repeat(2, 1fr)'
				}}
			>
				<Show
					when={!isPending}
					fallback={
						<For each={Array.from(Array(4))}>
							{(item, index) => (
								<Skeleton key={index} minHeight={48} width="full">
									{item}
								</Skeleton>
							)}
						</For>
					}
				>
					<For each={menu}>
						{(item, index) => {
							return (
								<Link key={index} href={item.url}>
									<Card.Root
										animationDuration={handleAnimationDuration(index)}
										animationName="slide-from-top, fade-in"
										aria-disabled={!item.is_active_menu}
										cursor={{ _disabled: 'not-allowed', base: 'pointer' }}
										height="full"
										hidden={isPending}
										variant={{ _disabled: 'subtle', base: 'outline' }}
									>
										<Card.Header alignItems="center" flexDirection="row" gap="4">
											<Box
												aria-disabled={!item.is_active_menu}
												borderColor="gray.300"
												borderRadius="sm"
												borderStyle="solid"
												borderWidth="thin"
												filter={{ _disabled: 'grayscale(80%)', base: '' }}
												padding="2"
											>
												<GenerateIcon
													icon={item.image_url}
													size={28}
													style={{ color: 'var(--chakra-colors-primary-fg)' }}
												/>
											</Box>
											<Text
												aria-disabled={!item.is_active_menu}
												color={{ _disabled: 'gray', base: 'primary.fg' }}
												fontWeight="semibold"
											>
												{item.applicationName}
											</Text>
										</Card.Header>
										<Card.Body>
											<Text color="gray" textStyle="xs" textWrap="pretty">
												{item.description}
											</Text>
										</Card.Body>
									</Card.Root>
								</Link>
							)
						}}
					</For>
				</Show>
			</Grid>
		</Center>
	)
}

export default Page
