import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { Case } from 'change-case-all'
import useButton from '@/stores/button-static'
import useGetRoute from '../../hooks/use-get-route'
import { Layout } from '../../types/default'

type TitleContainerProps = Layout & {
	title?: string
}

const TitleContainer: React.FC<TitleContainerProps> = ({ children, ...props }) => {
	const path = useGetRoute()
	const title = props.title || Case.capital(path)

	const { activate, back, deactivate, reactivate, submit } = useButton()

	const handleBackClick = () => {
		history.back()
	}

	return (
		<Stack gap="4">
			<Flex width="full" justifyContent="space-between">
				<Text textStyle="2xl" fontWeight="bold">
					{title}
				</Text>
				<Stack direction="row">
					<Button {...activate}>{activate?.title}</Button>
					<Button {...deactivate}>{deactivate?.title}</Button>
					<Button {...reactivate}>{reactivate?.title}</Button>
					<Button onClick={handleBackClick} {...back}>
						{back?.title}
					</Button>
					<Button {...submit}>{submit?.title}</Button>
				</Stack>
			</Flex>
			{children}
		</Stack>
	)
}

export default TitleContainer
