import { Flex, IconButton } from '@chakra-ui/react'
import Image from 'next/image'
import usePreference from '../../stores/preference'

const Header = () => {
	const { isSidebarOpen, setOpen } = usePreference()

	return (
		<Flex
			as="header"
			position="sticky"
			top="0"
			width="full"
			height="24"
			minHeight="24"
			maxHeight="24"
			backgroundColor={{ _dark: 'gray.900', _light: 'bg' }}
			zIndex="5"
		>
			<Flex
				height="full"
				width="full"
				padding="8"
				borderTopLeftRadius="4xl"
				backgroundColor={{ _dark: 'bg', _light: 'gray.100' }}
				justifyContent="space-between"
				alignItems="center"
			>
				<IconButton variant="ghost" onClick={() => setOpen(!isSidebarOpen)}>
					<Image
						src="/logo/symbol.svg"
						alt="bot"
						width={28}
						height={28}
						draggable={false}
						style={{ height: 'auto', width: 'auto' }}
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
