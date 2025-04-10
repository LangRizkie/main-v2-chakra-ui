'use client'

import { Button, Card, Center, Field, Input, Link, Presence } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import Countdown from 'react-countdown'
import { Controller, useForm } from 'react-hook-form'
import { CheckOTP, ResendOTP } from '@/libraries/mutation/user/user'
import { type CheckOTPPayload, CheckOTPSchema } from '@/libraries/schemas/user/user'
import { routes } from '@/utilities/constants'

const Page = () => {
	const search = useSearchParams()

	const checkOTP = useMutation({
		mutationFn: CheckOTP,
		mutationKey: ['check_otp']
	})

	const resendOTP = useMutation({
		mutationFn: ResendOTP,
		mutationKey: ['resend_otp']
	})

	const form = useForm<CheckOTPPayload>({
		defaultValues: {
			otp: '',
			username: ''
		},
		resolver: zodResolver(CheckOTPSchema)
	})

	const resendText = useMemo(() => {
		return resendOTP.isSuccess ? 'Resend again in' : 'Resend another one'
	}, [resendOTP.isSuccess])

	const countdown = () => {
		const date = Date.now() + 59000

		if (!resendOTP.isSuccess) return <></>

		return (
			<Countdown
				date={date}
				renderer={({ minutes, seconds }) => `${minutes}:${seconds}`}
				onComplete={() => resendOTP.reset()}
			/>
		)
	}

	const handleCheckOTPSubmit = (data: CheckOTPPayload) => {
		const redirect = [routes.forgot, '/', btoa(JSON.stringify(data))].join('')
		checkOTP
			.mutateAsync({ ...data, redirect })
			.then((res) => res)
			.catch((error) => error)
	}

	const handleResendOTP = () => {
		if (!resendOTP.isSuccess) {
			return resendOTP.mutateAsync({ username: form.getValues('username') })
		}
	}

	useEffect(() => {
		const username = search.get('username')
		if (username) form.setValue('username', username)
	}, [form, search])

	return (
		<Center height="100vh">
			<Presence
				present={!checkOTP.isSuccess}
				_open={{
					animationDuration: '300ms',
					animationName: 'slide-from-top, fade-in'
				}}
			>
				<Card.Root
					as="form"
					gap="4"
					width="2xl"
					onSubmit={form.handleSubmit(handleCheckOTPSubmit)}
				>
					<Card.Header>
						<Image
							alt="otp"
							height={192}
							src="/request-unlock/otp.svg"
							style={{ height: 192, width: 'auto' }}
							width={192}
							priority
						/>
					</Card.Header>
					<Card.Body alignItems="center" gap="4" justifyContent="center">
						<Card.Title textStyle="2xl">Request Unlock Account</Card.Title>
						<Card.Description maxWidth="lg" textAlign="center" textWrap="pretty">
							Please input your OTP from them email we sent to you
						</Card.Description>
						<Controller
							control={form.control}
							name="otp"
							render={(attribute) => (
								<Field.Root
									invalid={attribute.fieldState.invalid}
									maxWidth="md"
									readOnly={checkOTP.isPending}
								>
									<Field.Label>Email</Field.Label>
									<Input
										autoComplete="one-time-code"
										placeholder="Input OTP"
										autoFocus
										onChange={attribute.field.onChange}
									/>
									<Field.ErrorText>{attribute.fieldState.error?.message}</Field.ErrorText>
								</Field.Root>
							)}
						/>
					</Card.Body>
					<Card.Footer
						alignItems="center"
						flexDirection="column"
						gap="4"
						justifyContent="center"
					>
						<Button
							colorPalette="primary"
							loading={checkOTP.isPending}
							maxWidth="md"
							type="submit"
							width="full"
						>
							Submit
						</Button>
						<Link colorPalette="primary" textStyle="xs" onClick={handleResendOTP}>
							{resendText} {countdown()}
						</Link>
					</Card.Footer>
				</Card.Root>
			</Presence>
		</Center>
	)
}

export default Page
