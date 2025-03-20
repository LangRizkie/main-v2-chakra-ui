'use client'

import { Button, Card, Center, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { routes } from '../../utilities/constants'

const Page = () => {
	const router = useRouter()

	return (
		<Center height="100vh">
			<Card.Root
				width="2xl"
				gap="4"
				data-state="open"
				_open={{
					animationDuration: '300ms',
					animationName: 'slide-from-top, fade-in'
				}}
			>
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
					<Card.Title textStyle="2xl">Check Your Email</Card.Title>
					<Card.Description textAlign="center" maxWidth="lg" textWrap="pretty">
						A password recovery link has been sent to your registered email when you receive it
						click the link to open a window where you can enter a new password
					</Card.Description>
				</Card.Body>
				<Card.Footer flexDirection="column" justifyContent="center" alignItems="center" gap="6">
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
