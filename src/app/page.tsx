'use client'
import {
	Button,
	chakra,
	Field,
	Flex,
	Grid,
	GridItem,
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
	AuthenticatePayload,
	AuthenticateSchema,
	CheckUsernamePayload,
	CheckUsernameSchema
} from '@/libraries/schemas/user/common'
import { ReglaResponse } from '@/types/default'
import useUserProperty from '../stores/user-property'
import { ResponseUserData } from '../types/user/common'
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
						location.href = callback ? callback : routes.main
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
				const isLocked = (res.data && res.data.is_user_locked) || false
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
				const isLocked = (error.data && error.data.is_user_locked) || false

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
			width="full"
			height="100vh"
			maxWidth="none"
			padding="0"
			backgroundSize="cover"
			backgroundImage="url('/login/background.svg')"
			backgroundPosition="left"
			backgroundRepeat="no-repeat"
		>
			<Stack maxWidth={{ base: 'full', xl: '40%' }} height="full" alignItems="center">
				<Stack gap="6" width="xs" marginTop={{ base: '30%', xl: '24%' }} alignItems="center">
					<Image
						src="/logo/full.svg"
						alt="logo"
						width={192}
						height={192}
						style={{ height: 'auto', width: 'auto' }}
						draggable={false}
						priority
					/>
					<Stack gap="1" alignItems="center">
						<Text textStyle="xl">Hello Again!</Text>
						<Presence present={Boolean(username.data)}>
							<Text textStyle="2xs">{username.data?.message}</Text>
						</Presence>
					</Stack>
					<Presence
						width="full"
						present={!username.isSuccess}
						_open={{
							animationDuration: '300ms',
							animationName: 'slide-from-left, fade-in'
						}}
					>
						<Stack
							as="form"
							gap="4"
							width="full"
							alignItems="center"
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
											variant="subtle"
											placeholder="Username or Email"
											textAlign="center"
											autoFocus
										/>
										<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
									</Field.Root>
								)}
							/>
							<Button
								type="submit"
								colorPalette="primary"
								width="full"
								size="sm"
								loading={username.isPending}
							>
								Next
							</Button>
						</Stack>
					</Presence>
					<Show when={username.isSuccess}>
						<Stack
							as="form"
							gap="4"
							width="full"
							alignItems="center"
							data-state="open"
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
										invalid={attribute.fieldState.invalid}
										readOnly={authenticate.isPending}
										disabled={authenticateForm.getValues('isLocked')}
									>
										<Field.Label>{authenticateForm.getValues('username')}</Field.Label>
										<Password
											variant="subtle"
											placeholder="Password"
											textAlign="center"
											autoComplete="current-password"
											onChange={attribute.field.onChange}
											autoFocus
										/>
										<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
									</Field.Root>
								)}
							/>
							<Link
								colorPalette="primary"
								textStyle="xs"
								alignSelf="end"
								onClick={handleForgotPassword}
							>
								Forgot Password
							</Link>
							<Grid templateColumns="repeat(2, 1fr)" width="full" gap="4">
								<GridItem>
									<Button
										variant="subtle"
										width="full"
										size="sm"
										onClick={handleBack}
										disabled={authenticate.isPending}
									>
										Back
									</Button>
								</GridItem>
								<GridItem hidden={authenticateForm.getValues('isLocked')}>
									<Button
										type="submit"
										colorPalette="primary"
										width="full"
										size="sm"
										loading={authenticate.isPending}
									>
										Next
									</Button>
								</GridItem>
								<GridItem hidden={!authenticateForm.getValues('isLocked')}>
									<Button
										colorPalette="primary"
										width="full"
										size="sm"
										onClick={handleRequestUnlock}
									>
										Unlock Account
									</Button>
								</GridItem>
							</Grid>
						</Stack>
					</Show>
					<Flex gap="2" marginTop="12">
						<Iconify icon="bxs:info-circle" height={14} />
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
