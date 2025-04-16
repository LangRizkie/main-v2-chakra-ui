'use client'

import { Button, Card, Center, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { routes } from '../../utilities/constants'

const Page = () => {
	const router = useRouter()

	return (
		<Center height="dvh">
			<Card.Root
				data-state="open"
				gap="4"
				width="2xl"
				_open={{
					animationDuration: '300ms',
					animationName: 'slide-from-top, fade-in'
				}}
			>
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
					<Card.Title textStyle="2xl">Check Your Email</Card.Title>
					<Card.Description maxWidth="lg" textAlign="center" textWrap="pretty">
						A password recovery link has been sent to your registered email when you receive it
						click the link to open a window where you can enter a new password
					</Card.Description>
				</Card.Body>
				<Card.Footer alignItems="center" flexDirection="column" gap="6" justifyContent="center">
					<Button
						colorPalette="primary"
						minWidth="56"
						onClick={() => router.replace(routes.login)}
					>
						Back to Login Page
					</Button>
					<Text textStyle="xs">Did not receive it? try to check your spam folder.</Text>
				</Card.Footer>
			</Card.Root>
		</Center>
	)
}

export default Page
