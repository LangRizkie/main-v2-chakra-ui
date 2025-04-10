'use client'
import {
	Button,
	chakra,
	Field,
	Flex,
	Grid,
	GridItem,
	Heading,
	Input,
	Link,
	Presence,
	Show,
	Stack,
	Text,
	VisuallyHidden
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import Iconify from '@/components/ui/iconify'
import { Password } from '@/components/ui/password'
import { useColorMode } from '@/hooks/use-color-mode'
import {
	Authenticate,
	CheckUsername,
	ForgotPassword,
	GetUserProperty
} from '@/libraries/mutation/user/common'
import {
	type AuthenticatePayload,
	AuthenticateSchema,
	type CheckUsernamePayload,
	CheckUsernameSchema
} from '@/libraries/schemas/user/common'
import type { ReglaResponse } from '@/types/default'
import useUserProperty from '../stores/user-property'
import type { ResponseUserData } from '../types/user/common'
import { routes, storages } from '../utilities/constants'
import { setCredential } from '../utilities/credentials'
import toast from '../utilities/toast'

const Page = () => {
	const router = useRouter()
	const search = useSearchParams()
	const { setUserProperty } = useUserProperty()
	const { setColorMode } = useColorMode()

	const username = useMutation({
		mutationFn: CheckUsername,
		mutationKey: ['check_username']
	})

	const authenticate = useMutation({
		mutationFn: Authenticate,
		mutationKey: ['authenticate']
	})

	const getUserProperty = useMutation({
		mutationFn: GetUserProperty,
		mutationKey: ['get_user_property']
	})

	const forgotPassword = useMutation({
		mutationFn: ForgotPassword,
		mutationKey: ['forgot_password']
	})

	const usernameForm = useForm<CheckUsernamePayload>({
		defaultValues: {
			username: ''
		},
		resolver: zodResolver(CheckUsernameSchema)
	})

	const authenticateForm = useForm<AuthenticatePayload>({
		defaultValues: {
			isLocked: false,
			password: '',
			username: ''
		},
		resolver: zodResolver(AuthenticateSchema)
	})

	const handleGetUserProperty = async () => {
		await getUserProperty.mutateAsync().then((res) => {
			setUserProperty(res)
			toast.success({
				duration: 1200,
				onStatusChange: ({ status }) => {
					if (status === 'unmounted') {
						const callback = search.get('callback')
						setColorMode(res.is_dark_mode ? 'dark' : 'light')
						location.href = callback ?? routes.main
					}
				},
				title: `Welcome, ${res.username}!`
			})
		})
	}

	const handleUsernameFormSubmit = (data: CheckUsernamePayload) => {
		username
			.mutateAsync({ username: data.username })
			.then((res) => {
				const isLocked = res.data?.is_user_locked || false
				authenticateForm.reset({ isLocked, username: data.username })
			})
			.catch((error: ReglaResponse) => {
				usernameForm.setError('username', { message: error.message })
			})
	}

	const handleAuthenticateFormSubmit = (data: AuthenticatePayload) => {
		authenticate
			.mutateAsync(data)
			.then(setCredential)
			.then(handleGetUserProperty)
			.catch((error: ReglaResponse<ResponseUserData>) => {
				const isLocked = error.data?.is_user_locked || false

				authenticateForm.setValue('isLocked', isLocked)
				authenticateForm.setError('password', { message: error.message })
			})
	}

	const handleForgotPassword = () => {
		const id = crypto.randomUUID()
		toast.create({ id, title: 'Please wait...', type: 'loading' })

		forgotPassword
			.mutateAsync({
				username: authenticateForm.getValues('username')
			})
			.then(() => router.push(routes.forgot))
			.finally(() => toast.dismiss(id))
	}

	const handleRequestUnlock = () => {
		sessionStorage.setItem(storages.username, authenticateForm.getValues('username'))

		router.push(routes.request_unlock)
	}

	const handleBack = () => {
		username.reset()
		usernameForm.reset()
		authenticateForm.reset()
	}

	return (
		<chakra.main
			backgroundImage="url('/login/background.svg')"
			backgroundPosition="left"
			backgroundRepeat="no-repeat"
			backgroundSize="cover"
			height="100vh"
			maxWidth="none"
			padding="0"
			width="full"
		>
			<Stack alignItems="center" height="full" maxWidth={{ base: 'full', xl: '40%' }}>
				<Stack alignItems="center" gap="6" marginTop={{ base: '30%', xl: '24%' }} width="xs">
					<Image
						alt="logo"
						draggable={false}
						height={192}
						src="/logo/full.svg"
						style={{ height: 'auto', width: 'auto' }}
						width={192}
						priority
					/>
					<Stack alignItems="center" gap="1">
						<Heading size="xl">Hello Again!</Heading>
						<Presence present={Boolean(username.data)}>
							<Text textStyle="2xs">{username.data?.message}</Text>
						</Presence>
					</Stack>
					<Presence
						present={!username.isSuccess}
						width="full"
						_open={{
							animationDuration: '300ms',
							animationName: 'slide-from-left, fade-in'
						}}
					>
						<Stack
							alignItems="center"
							as="form"
							gap="4"
							width="full"
							onSubmit={usernameForm.handleSubmit(handleUsernameFormSubmit)}
						>
							<Controller
								control={usernameForm.control}
								name="username"
								render={(attribute) => (
									<Field.Root
										invalid={attribute.fieldState.invalid}
										readOnly={username.isPending}
									>
										<Input
											{...attribute.field}
											placeholder="Username or Email"
											textAlign="center"
											variant="subtle"
											autoFocus
										/>
										<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
									</Field.Root>
								)}
							/>
							<Button
								colorPalette="primary"
								loading={username.isPending}
								size="sm"
								type="submit"
								width="full"
							>
								Next
							</Button>
						</Stack>
					</Presence>
					<Show when={username.isSuccess}>
						<Stack
							alignItems="center"
							as="form"
							data-state="open"
							gap="4"
							width="full"
							_open={{
								animationDuration: '300ms',
								animationName: 'slide-from-left, fade-in'
							}}
							onSubmit={authenticateForm.handleSubmit(handleAuthenticateFormSubmit)}
						>
							<VisuallyHidden>
								<Input autoComplete="username email" />
							</VisuallyHidden>
							<Controller
								control={authenticateForm.control}
								name="password"
								render={(attribute) => (
									<Field.Root
										disabled={authenticateForm.getValues('isLocked')}
										invalid={attribute.fieldState.invalid}
										readOnly={authenticate.isPending}
									>
										<Field.Label>{authenticateForm.getValues('username')}</Field.Label>
										<Password
											autoComplete="current-password"
											placeholder="Password"
											textAlign="center"
											variant="subtle"
											autoFocus
											onChange={attribute.field.onChange}
										/>
										<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
									</Field.Root>
								)}
							/>
							<Link
								alignSelf="end"
								colorPalette="primary"
								textStyle="xs"
								onClick={handleForgotPassword}
							>
								Forgot Password
							</Link>
							<Grid gap="4" templateColumns="repeat(2, 1fr)" width="full">
								<GridItem>
									<Button
										disabled={authenticate.isPending}
										size="sm"
										variant="subtle"
										width="full"
										onClick={handleBack}
									>
										Back
									</Button>
								</GridItem>
								<GridItem hidden={authenticateForm.getValues('isLocked')}>
									<Button
										colorPalette="primary"
										loading={authenticate.isPending}
										size="sm"
										type="submit"
										width="full"
									>
										Next
									</Button>
								</GridItem>
								<GridItem hidden={!authenticateForm.getValues('isLocked')}>
									<Button
										colorPalette="primary"
										size="sm"
										width="full"
										onClick={handleRequestUnlock}
									>
										Unlock Account
									</Button>
								</GridItem>
							</Grid>
						</Stack>
					</Show>
					<Flex gap="2" marginTop="12">
						<Iconify height={14} icon="bxs:info-circle" />
						<Text textStyle="xs" textWrap="pretty">
							You are authorized to use this system, and those to which it grants access, for
							approved business purposes only. Use for any other purpose is prohibited.
						</Text>
					</Flex>
				</Stack>
			</Stack>
		</chakra.main>
	)
}

export default Page
