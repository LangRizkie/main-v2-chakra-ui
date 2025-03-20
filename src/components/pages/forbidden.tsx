import { Card, Center, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'

const Forbidden = () => (
	<Card.Root size="lg">
		<Card.Header></Card.Header>
		<Card.Body>
			<Center gap="12" flexDirection="column">
				<Image
					src="/forbidden.svg"
					alt="forbidden"
					width={384}
					height={384}
					style={{ height: 384, width: 'auto' }}
					draggable={false}
					priority
				/>
				<Stack textAlign="center">
					<Text color="primary.fg" textStyle="lg" fontWeight="semibold">
						Error 403
					</Text>
					<Text color="primary.fg" textStyle="xs" fontWeight="semibold">
						Forbidden
					</Text>
				</Stack>
				<Text color="gray" textStyle="sm">
					You do not have permission to access or on this server
				</Text>
			</Center>
		</Card.Body>
		<Card.Footer></Card.Footer>
	</Card.Root>
)
export default Forbidden
