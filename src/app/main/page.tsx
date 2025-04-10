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
import Link from 'next/link'
import { useMemo } from 'react'
import Iconify from '../../components/ui/iconify'
import Tooltip from '../../components/ui/tooltip'
import { logout } from '../../config/instance'
import { GetPlatform } from '../../libraries/mutation/platform-settings/master-application'
import { GenerateIcon } from '../../utilities/helper'

const Page = () => {
	const { data, isPending } = useQuery({
		queryFn: GetPlatform,
		queryKey: ['get_platform']
	})

	const menu = useMemo(() => {
		return data?.data || []
	}, [data])

	const handleAnimationDuration = (index: number) => {
		return (index + 1) * 200 + 'ms'
	}

	return (
		<Center flexDirection="column" gap="16" minHeight="100vh" padding="16">
			<Flex
				alignItems="center"
				flexDirection={{ base: 'column', lg: 'row' }}
				gap="12"
				justifyContent="space-between"
				width="full"
			>
				<Stack gap="4">
					<Text
						color="gray"
						fontWeight="bold"
						textAlign={{ base: 'center', lg: 'left' }}
						textStyle="3xl"
					>
						Welcome To Regla Platform
					</Text>
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
					<Tooltip content="Chatbot AI" showArrow>
						<IconButton colorPalette="gray" rounded="full" variant="surface">
							<Image alt="bot" draggable={false} height={20} src="/bam.svg" width={20} />
						</IconButton>
					</Tooltip>
					<Tooltip content="Notification" showArrow>
						<IconButton rounded="full" variant="ghost">
							<Iconify height={20} icon="bxs:bell" />
						</IconButton>
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
				<For each={Array.from(Array(8))}>
					{(item, index) => (
						<Skeleton key={index} hidden={!isPending} minHeight={48} width="full">
							{item}
						</Skeleton>
					)}
				</For>
				<For each={menu}>
					{(item, index) => {
						return (
							<Link key={index} href={item.url} passHref>
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
			</Grid>
		</Center>
	)
}

export default Page
