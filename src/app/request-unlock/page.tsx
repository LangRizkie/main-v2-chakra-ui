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
	RequestUnlockAccountPayload,
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
					width="2xl"
					gap="4"
					onSubmit={form.handleSubmit(handleRequestUnlockSubmit)}
				>
					<Card.Header>
						<Image
							src="/request-unlock/request.svg"
							alt="request unlock"
							width={192}
							height={192}
							style={{ height: 192, width: 'auto' }}
							priority
						/>
					</Card.Header>
					<Card.Body justifyContent="center" alignItems="center" gap="4">
						<Card.Title textStyle="2xl">Request Unlock Account</Card.Title>
						<Card.Description textAlign="center" textWrap="pretty" maxWidth="lg">
							Please input your email to notify the administrator to unlock the account
						</Card.Description>
						<Controller
							control={form.control}
							name="email"
							render={(attribute) => (
								<Field.Root
									maxWidth="md"
									invalid={attribute.fieldState.invalid}
									readOnly={requestUnlockAccount.isPending}
								>
									<Field.Label>Email</Field.Label>
									<Input
										type="email"
										placeholder="Input email"
										autoComplete="email"
										onChange={attribute.field.onChange}
										autoFocus
									/>
									<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
								</Field.Root>
							)}
						/>
					</Card.Body>
					<Card.Footer justifyContent="center" alignItems="center">
						<Button
							type="submit"
							colorPalette="primary"
							width="full"
							maxWidth="md"
							loading={requestUnlockAccount.isPending}
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
				<Card.Root width="2xl" gap="4">
					<Card.Header>
						<Image
							src="/email.svg"
							alt="email"
							width={192}
							height={192}
							style={{ height: 192, width: 'auto' }}
							priority
						/>
					</Card.Header>
					<Card.Body justifyContent="center" alignItems="center" gap="4">
						<Card.Title textStyle="2xl">Request Email Has Been Sent</Card.Title>
						<Card.Description textAlign="center" maxWidth="lg" textWrap="pretty">
							Thank you for submitting your account unlock request. An email notification has
							been sent to the administrator. Please allow some time for them to review and
							process your request. We appreciate your patience
						</Card.Description>
					</Card.Body>
					<Card.Footer
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						gap="6"
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
