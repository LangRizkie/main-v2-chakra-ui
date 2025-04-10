import { Button, ButtonGroup, Flex, Stack, Text } from '@chakra-ui/react'
import { Case } from 'change-case-all'
import { useEffect, useMemo } from 'react'
import useStaticStore from '@/stores/button-static'
import useGetRoute from '../../hooks/use-get-route'
import type { Layout } from '../../types/default'

type TitleContainerProps = Layout & {
	title?: string
}

const TitleContainer: React.FC<TitleContainerProps> = ({ children, ...props }) => {
	const { activate, back, deactivate, reactivate, setTitle, submit, title } = useStaticStore()

	const path = useGetRoute()
	const main = props.title ?? Case.capital(path)

	const isGroupLoading = useMemo(() => {
		return activate?.loading || deactivate?.loading || reactivate?.loading || submit?.loading
	}, [activate?.loading, deactivate?.loading, reactivate?.loading, submit?.loading])

	useEffect(() => {
		setTitle(main)
	}, [main, setTitle, title])

	return (
		<Stack gap="4" width="full">
			<Flex justifyContent="space-between" width="full">
				<Text fontWeight="bold" textStyle="2xl">
					{main}
				</Text>
				<ButtonGroup>
					<Button {...activate} disabled={activate?.disabled || isGroupLoading}>
						{activate?.children || activate?.title}
					</Button>
					<Button {...deactivate} disabled={deactivate?.disabled || isGroupLoading}>
						{deactivate?.children || deactivate?.title}
					</Button>
					<Button {...reactivate} disabled={reactivate?.disabled || isGroupLoading}>
						{reactivate?.children || reactivate?.title}
					</Button>
					<Button onClick={() => history.back()} {...back}>
						{back?.title}
					</Button>
					<Button {...submit} disabled={submit?.disabled || isGroupLoading}>
						{submit?.children || submit?.title}
					</Button>
				</ButtonGroup>
			</Flex>
			{children}
		</Stack>
	)
}

export default TitleContainer
