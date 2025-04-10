import { Flex, IconButton } from '@chakra-ui/react'
import Image from 'next/image'
import usePreference from '../../stores/preference'

const Header = () => {
	const { isSidebarOpen, setOpen } = usePreference()

	return (
		<Flex
			as="header"
			backgroundColor={{ _dark: 'gray.900', _light: 'bg' }}
			height="24"
			maxHeight="24"
			minHeight="24"
			position="sticky"
			top="0"
			width="full"
			zIndex="5"
		>
			<Flex
				alignItems="center"
				backgroundColor={{ _dark: 'bg', _light: 'gray.100' }}
				borderTopLeftRadius="4xl"
				height="full"
				justifyContent="space-between"
				padding="8"
				width="full"
			>
				<IconButton variant="ghost" onClick={() => setOpen(!isSidebarOpen)}>
					<Image
						alt="bot"
						draggable={false}
						height={28}
						src="/logo/symbol.svg"
						style={{ height: 'auto', width: 'auto' }}
						width={28}
					/>
				</IconButton>
				<Flex alignItems="center" gap="4">
					<p>search</p>
					<p>chatbot</p>
					<p>notification</p>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Header
