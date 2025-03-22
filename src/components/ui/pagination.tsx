import {
	ButtonGroup,
	createListCollection,
	Flex,
	For,
	IconButton,
	Pagination as ChakraPagination,
	Portal,
	Select,
	Text
} from '@chakra-ui/react'
import { useMemo } from 'react'
import { values } from '@/utilities/validation'
import Iconify from './iconify'

export type PageChangeDetails = {
	page: number
	pageSize: number
}

type PaginationProps = {
	start: number
	length: number
	recordsTotal: number
	onPageChange?: (value: PageChangeDetails) => void
}

const Pagination: React.FC<PaginationProps> = (props) => {
	const handlePerPageList = useMemo(() => {
		return values.per.map((item) => ({ value: item.toString() }))
	}, [])

	const list = createListCollection({
		items: handlePerPageList
	})

	return (
		<Flex direction="row" gap="8" alignItems="center">
			<Text>Items per page:</Text>
			<Select.Root
				key={crypto.randomUUID()}
				collection={list}
				defaultValue={[props.length.toString()]}
				size="sm"
				width="24"
				onValueChange={({ value }) => {
					if (props.onPageChange) props.onPageChange({ page: 1, pageSize: Number(value[0]) })
				}}
			>
				<Select.HiddenSelect />
				<Select.Label />
				<Select.Control>
					<Select.Trigger>
						<Select.ValueText />
					</Select.Trigger>
					<Select.IndicatorGroup>
						<Select.Indicator />
					</Select.IndicatorGroup>
				</Select.Control>
				<Portal>
					<Select.Positioner>
						<Select.Content>
							<For each={list.items}>
								{(item) => (
									<Select.Item item={item} key={item.value}>
										{item.value}
										<Select.ItemIndicator />
									</Select.Item>
								)}
							</For>
						</Select.Content>
					</Select.Positioner>
				</Portal>
			</Select.Root>
			<ChakraPagination.Root
				key={props.start}
				count={props.recordsTotal}
				pageSize={props.length}
				defaultPage={props.start + 1}
				onPageChange={props.onPageChange}
			>
				<ButtonGroup variant="ghost" size="sm" w="full">
					<ChakraPagination.PageText format="long" flex="1" />
					<ChakraPagination.PrevTrigger asChild>
						<IconButton>
							<Iconify icon="bx:chevron-left" height="20" />
						</IconButton>
					</ChakraPagination.PrevTrigger>
					<ChakraPagination.NextTrigger asChild>
						<IconButton>
							<Iconify icon="bx:chevron-right" height="20" />
						</IconButton>
					</ChakraPagination.NextTrigger>
				</ButtonGroup>
			</ChakraPagination.Root>
		</Flex>
	)
}

export default Pagination
