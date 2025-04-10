'use client'

import { Button, Card, Center, Field, Input, Presence } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { RequestUnlockAccount } from '../../libraries/mutation/user/user'
import {
	type RequestUnlockAccountPayload,
	RequestUnlockAccountSchema
} from '../../libraries/schemas/user/user'
import { routes, storages } from '../../utilities/constants'

const Page = () => {
	const router = useRouter()

	const requestUnlockAccount = useMutation({
		mutationFn: RequestUnlockAccount,
		mutationKey: ['request_unlock_account']
	})

	const form = useForm<RequestUnlockAccountPayload>({
		defaultValues: {
			email: '',
			username: ''
		},
		resolver: zodResolver(RequestUnlockAccountSchema)
	})

	const handleRequestUnlockSubmit = (data: RequestUnlockAccountPayload) => {
		requestUnlockAccount
			.mutateAsync(data)
			.then(() => sessionStorage.removeItem(storages.username))
	}

	useEffect(() => {
		const username = sessionStorage.getItem(storages.username)
		if (username) form.setValue('username', username)
	}, [form])

	return (
		<Center height="100vh">
			<Presence
				present={!requestUnlockAccount.isSuccess}
				_open={{
					animationDuration: '300ms',
					animationName: 'slide-from-top, fade-in'
				}}
			>
				<Card.Root
					as="form"
					gap="4"
					width="2xl"
					onSubmit={form.handleSubmit(handleRequestUnlockSubmit)}
				>
					<Card.Header>
						<Image
							alt="request unlock"
							height={192}
							src="/request-unlock/request.svg"
							style={{ height: 192, width: 'auto' }}
							width={192}
							priority
						/>
					</Card.Header>
					<Card.Body alignItems="center" gap="4" justifyContent="center">
						<Card.Title textStyle="2xl">Request Unlock Account</Card.Title>
						<Card.Description maxWidth="lg" textAlign="center" textWrap="pretty">
							Please input your email to notify the administrator to unlock the account
						</Card.Description>
						<Controller
							control={form.control}
							name="email"
							render={(attribute) => (
								<Field.Root
									invalid={attribute.fieldState.invalid}
									maxWidth="md"
									readOnly={requestUnlockAccount.isPending}
								>
									<Field.Label>Email</Field.Label>
									<Input
										autoComplete="email"
										placeholder="Input email"
										type="email"
										autoFocus
										onChange={attribute.field.onChange}
									/>
									<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
								</Field.Root>
							)}
						/>
					</Card.Body>
					<Card.Footer alignItems="center" justifyContent="center">
						<Button
							colorPalette="primary"
							loading={requestUnlockAccount.isPending}
							maxWidth="md"
							type="submit"
							width="full"
						>
							Submit
						</Button>
					</Card.Footer>
				</Card.Root>
			</Presence>
			<Presence
				present={requestUnlockAccount.isSuccess}
				_open={{
					animationDuration: '300ms',
					animationName: 'slide-from-top, fade-in'
				}}
			>
				<Card.Root gap="4" width="2xl">
					<Card.Header>
						<Image
							alt="email"
							height={192}
							src="/email.svg"
							style={{ height: 192, width: 'auto' }}
							width={192}
							priority
						/>
					</Card.Header>
					<Card.Body alignItems="center" gap="4" justifyContent="center">
						<Card.Title textStyle="2xl">Request Email Has Been Sent</Card.Title>
						<Card.Description maxWidth="lg" textAlign="center" textWrap="pretty">
							Thank you for submitting your account unlock request. An email notification has
							been sent to the administrator. Please allow some time for them to review and
							process your request. We appreciate your patience
						</Card.Description>
					</Card.Body>
					<Card.Footer
						alignItems="center"
						flexDirection="column"
						gap="6"
						justifyContent="center"
					>
						<Button
							colorPalette="primary"
							minWidth="56"
							onClick={() => router.replace(routes.login)}
						>
							Back to Login Page
						</Button>
					</Card.Footer>
				</Card.Root>
			</Presence>
		</Center>
	)
}

export default Page
