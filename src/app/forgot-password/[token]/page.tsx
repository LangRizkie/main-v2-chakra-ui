'use client'

import { Button, Card, Center, Field, Link, Stack, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Password, PasswordMeter } from '@/components/ui/password'
import { ResetPasswordWithToken } from '@/libraries/mutation/user/common'
import { UnlockAccount } from '@/libraries/mutation/user/user'
import {
	type ResetPasswordWithTokenPayload,
	ResetPasswordWithTokenSchema
} from '@/libraries/schemas/user/common'
import { type UnlockAccountPayload, UnlockAccountSchema } from '@/libraries/schemas/user/user'
import { routes } from '@/utilities/constants'
import { getPasswordScore, isJSON } from '@/utilities/validation'

const Page = () => {
	const params = useParams()

	const resetPassword = useMutation({
		mutationFn: ResetPasswordWithToken,
		mutationKey: ['reset_password']
	})

	const unlockAccount = useMutation({
		mutationFn: UnlockAccount,
		mutationKey: ['unlock_account']
	})

	const resetPasswordForm = useForm<ResetPasswordWithTokenPayload>({
		defaultValues: {
			confirmationPassword: '',
			newPassword: '',
			token: ''
		},
		resolver: zodResolver(ResetPasswordWithTokenSchema)
	})

	const unlockAccountForm = useForm<UnlockAccountPayload>({
		defaultValues: {
			confirmationPassword: '',
			newPassword: '',
			otp: '',
			username: ''
		},
		resolver: zodResolver(UnlockAccountSchema)
	})

	const isUnlockAccount = !!unlockAccountForm.watch('otp')
	const score = getPasswordScore(resetPasswordForm.watch('newPassword'))

	const handleResetPasswordFormSubmit = (data: ResetPasswordWithTokenPayload) => {
		resetPassword.mutateAsync(data).catch((error) => error)
	}

	const handleUnlockAccountFormSubmit = (data: UnlockAccountPayload) => {
		unlockAccount.mutateAsync(data).catch((error) => error)
	}

	useEffect(() => {
		const { token } = params

		if (token) {
			const decode = atob(decodeURIComponent(token.toString()))
			const parsed: UnlockAccountPayload | undefined = isJSON(decode)
				? JSON.parse(decode)
				: undefined

			if (!isEmpty(parsed)) {
				unlockAccountForm.reset({
					otp: parsed.otp,
					username: parsed.username
				})

				return
			}

			resetPasswordForm.setValue('token', decodeURIComponent(token.toString()))
		}
	}, [resetPasswordForm, params, unlockAccountForm])

	return (
		<Center height="100vh">
			<Card.Root
				as="form"
				data-state="open"
				gap="4"
				width="2xl"
				_open={{
					animationDuration: '300ms',
					animationName: 'slide-from-top, fade-in'
				}}
				onSubmit={
					isUnlockAccount
						? unlockAccountForm.handleSubmit(handleUnlockAccountFormSubmit)
						: resetPasswordForm.handleSubmit(handleResetPasswordFormSubmit)
				}
			>
				<Card.Header alignItems="center" flexDirection="row" gap="4" justifyContent="center">
					<Image
						alt="logo"
						height={40}
						src="/logo/compact.svg"
						style={{ height: 40, width: 'auto' }}
						width={40}
						priority
					/>
					<Text fontWeight="semibold" textStyle="3xl">
						Create New Password
					</Text>
				</Card.Header>
				<Card.Body alignItems="center" gap="6" justifyContent="center">
					<Card.Description maxWidth="lg" textAlign="center" textWrap="pretty">
						Your new password must be different from previous used password
					</Card.Description>
					<Stack width="sm">
						<Controller
							control={resetPasswordForm.control}
							name="newPassword"
							render={(attribute) => (
								<Field.Root
									invalid={attribute.fieldState.invalid}
									readOnly={resetPassword.isPending || unlockAccount.isPending}
									required
								>
									<Field.Label>
										<Field.RequiredIndicator />
										New Password
									</Field.Label>
									<Password
										autoComplete="new-password"
										placeholder="Input new password"
										autoFocus
										onChange={(e) => {
											resetPasswordForm.setValue(attribute.field.name, e.target.value, {
												shouldDirty: true
											})

											unlockAccountForm.setValue(attribute.field.name, e.target.value, {
												shouldDirty: true
											})

											resetPasswordForm.trigger(attribute.field.name)
											unlockAccountForm.trigger(attribute.field.name)

											if (
												resetPasswordForm.getFieldState('confirmationPassword').isDirty ||
												unlockAccountForm.getFieldState('confirmationPassword').isDirty
											) {
												resetPasswordForm.trigger('confirmationPassword')
												unlockAccountForm.trigger('confirmationPassword')
											}
										}}
									/>
									<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
								</Field.Root>
							)}
						/>
						<PasswordMeter value={score} />
					</Stack>
					<Controller
						control={resetPasswordForm.control}
						name="confirmationPassword"
						render={(attribute) => (
							<Field.Root
								invalid={attribute.fieldState.invalid}
								maxWidth="sm"
								readOnly={resetPassword.isPending || unlockAccount.isPending}
								required
							>
								<Field.Label>
									<Field.RequiredIndicator />
									Confirmation Password
								</Field.Label>
								<Password
									autoComplete="new-password"
									placeholder="Input confirmation password"
									autoFocus
									onChange={(e) => {
										resetPasswordForm.setValue(attribute.field.name, e.target.value, {
											shouldDirty: true
										})

										unlockAccountForm.setValue(attribute.field.name, e.target.value, {
											shouldDirty: true
										})

										resetPasswordForm.trigger(attribute.field.name)
										unlockAccountForm.trigger(attribute.field.name)
									}}
								/>
								<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
							</Field.Root>
						)}
					/>
				</Card.Body>
				<Card.Footer alignItems="center" flexDirection="column" gap="6" justifyContent="center">
					<Button
						colorPalette="primary"
						loading={resetPassword.isPending || unlockAccount.isPending}
						minWidth="56"
						type="submit"
					>
						Reset Password
					</Button>
					<Text textStyle="xs">
						Already remember your old password? back to&nbsp;
						<Link colorPalette="primary" href={routes.login}>
							Login Page
						</Link>
					</Text>
				</Card.Footer>
			</Card.Root>
		</Center>
	)
}

export default Page
