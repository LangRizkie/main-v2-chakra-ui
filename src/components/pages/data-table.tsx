import {
	Button,
	Card,
	createListCollection,
	Field,
	For,
	Grid,
	GridItem,
	Group,
	IconButton,
	Input,
	InputGroup,
	Menu,
	Portal,
	Select,
	SelectValueChangeDetails,
	Separator,
	Show,
	Stack,
	useDisclosure
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'ahooks'
import { groupBy, isEmpty } from 'lodash'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import useGetRoute from '@/hooks/use-get-route'
import { GetLookupCustomView } from '@/libraries/mutation/user/common'
import { GetNavigationScreenData } from '@/types/user/common'
import { GetPrivilegeData } from '@/types/user/security-role'
import { routes } from '@/utilities/constants'
import { createQueryParams, setQueryParams } from '@/utilities/helper'
import Iconify from '../ui/iconify'
import Tooltip from '../ui/tooltip'

type DataTableProps = {
	navigation: GetNavigationScreenData[]
	privilege: GetPrivilegeData[]
}

type ComponentProps = {
	index: number
	navigation: GetNavigationScreenData
	privilege: GetPrivilegeData
}

const Filter: React.FC<ComponentProps> = ({ navigation }) => {
	const router = useRouter()
	const screenId = useGetRoute()
	const pathname = usePathname()
	const search = useSearchParams()

	const { data } = useQuery({
		queryFn: () => GetLookupCustomView({ screenId }),
		queryKey: ['get_lookup_custom_view', screenId]
	})

	const custom = useMemo(() => {
		return (data && data.data) || []
	}, [data])

	const selected = useMemo(() => {
		return search.get('condition') === 'All' ? '' : (search.get('condition') ?? '')
	}, [search])

	const initial = useMemo(() => {
		const list = custom.map((item) => ({
			category: item.is_standard_view ? 'standard' : 'custom',
			label: item.desc,
			value: item.id
		}))

		if (navigation.is_all_category) {
			list.unshift({ category: 'standard', label: 'All', value: '' })
		}

		return list
	}, [custom, navigation.is_all_category])

	const filter = createListCollection({
		items: initial
	})

	const categories = Object.entries(groupBy(filter.items, (item) => item.category))

	const handleValueChange = (item: SelectValueChangeDetails) => {
		const value = item.value.find((v) => !!v)
		const queries = setQueryParams(
			search.toString(),
			{ condition: value ?? 'All' },
			{ route: pathname }
		)

		router.replace(queries)
	}

	return (
		<Select.Root
			size="sm"
			minWidth={{ base: 16, xl: 32 }}
			maxWidth="48"
			collection={filter}
			defaultValue={[selected]}
			onValueChange={handleValueChange}
		>
			<Select.HiddenSelect />
			<Select.Control>
				<Select.Trigger>
					<Stack direction="row" alignItems="center">
						<Iconify icon="bx:customize" height={16} />
						<Select.ValueText width="fit" />
					</Stack>
				</Select.Trigger>
				<Select.IndicatorGroup>
					<Select.Indicator />
				</Select.IndicatorGroup>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content>
						<For each={categories}>
							{([category, items], index) => (
								<Select.ItemGroup key={category}>
									<Select.ItemGroupLabel textStyle="xs">{category}</Select.ItemGroupLabel>
									<For each={items}>
										{(item) => (
											<Select.Item item={item} key={item.value}>
												{item.label}
												<Select.ItemIndicator />
											</Select.Item>
										)}
									</For>
									<Show when={index > items.length - 1}>
										<Separator />
									</Show>
								</Select.ItemGroup>
							)}
						</For>
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
	)
}

const By: React.FC<ComponentProps> = ({ navigation }) => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()

	const columns = useMemo(() => {
		if (!navigation.map_column) return []

		return [
			{ label: 'All', value: '' },
			...navigation.map_column.map((item) => ({
				label: item.value,
				value: item.object_name
			}))
		]
	}, [navigation])

	const selected = useMemo(() => {
		return search.get('column') === 'All' ? '' : (search.get('column') ?? '')
	}, [search])

	const handleValueChange = (item: SelectValueChangeDetails) => {
		const value = item.value.find((v) => !!v)
		const queries = setQueryParams(
			search.toString(),
			{ column: value ?? 'All' },
			{ route: pathname }
		)

		router.replace(queries)
	}

	const filter = createListCollection({
		items: columns
	})

	return (
		<Select.Root
			size="sm"
			minWidth={{ base: 16, xl: 32 }}
			maxWidth="48"
			collection={filter}
			defaultValue={[selected]}
			onValueChange={handleValueChange}
		>
			<Select.HiddenSelect />
			<Select.Control>
				<Select.Trigger
					borderRight="none"
					borderTopRightRadius="none"
					borderBottomRightRadius="none"
				>
					<Select.ValueText />
				</Select.Trigger>
				<Select.IndicatorGroup>
					<Select.Indicator />
				</Select.IndicatorGroup>
			</Select.Control>
			<Portal>
				<Select.Positioner>
					<Select.Content>
						<For each={filter.items}>
							{(item) => (
								<Select.Item item={item} key={item.value}>
									{item.label}
									<Select.ItemIndicator />
								</Select.Item>
							)}
						</For>
					</Select.Content>
				</Select.Positioner>
			</Portal>
		</Select.Root>
	)
}

const Search: React.FC<ComponentProps> = () => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()

	const [value, setValue] = useState<string>(search.get('search') ?? '')
	const debounce = useDebounce(value, { wait: 500 })

	const queries = setQueryParams(
		search.toString(),
		{ search: debounce ?? '' },
		{ route: pathname }
	)

	useEffect(() => {
		router.replace(queries)
	}, [queries, router])

	return (
		<Field.Root>
			<InputGroup startElement={<Iconify icon="bx:search" height={16} />}>
				<Input
					width="full"
					minWidth={{ base: 32, xl: 56 }}
					placeholder="Search..."
					size="sm"
					borderTopLeftRadius="none"
					borderBottomLeftRadius="none"
					autoComplete="off"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</InputGroup>
		</Field.Root>
	)
}

const Toolbar: React.FC<ComponentProps> = ({ navigation }) => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()
	const { open, setOpen } = useDisclosure()

	const [sort, setSort] = useState<string>(search.get('sort') ?? '')
	const [by, setBy] = useState<string>(search.get('by') ?? '')

	const sorts = useMemo(() => {
		if (!navigation.map_column) return []

		return [
			{ label: 'Default', value: '' },
			...navigation.map_column.map((item) => ({
				label: item.value,
				value: item.object_name
			}))
		]
	}, [navigation])

	const bys = useMemo(() => {
		return [
			{ label: 'Descending', value: 'DESC' },
			{ label: 'Ascending', value: 'ASC' }
		]
	}, [])

	const handleSortChange = () => {
		setOpen(false)

		const queries = setQueryParams(search.toString(), { by, sort }, { route: pathname })
		router.replace(queries)
	}

	const customViewRoute = useMemo(() => {
		return [pathname, routes.custom_view].join('')
	}, [pathname])

	return (
		<Stack direction="row">
			<Tooltip content="Download" showArrow>
				<IconButton variant="ghost" size="sm">
					<Iconify icon="bxs:download" height="20" />
				</IconButton>
			</Tooltip>
			<Tooltip content="Filter" showArrow>
				<Menu.Root
					open={open}
					closeOnSelect={false}
					onOpenChange={(item) => setOpen(item.open)}
					onEscapeKeyDown={() => setOpen(false)}
					onInteractOutside={() => setOpen(false)}
				>
					<Menu.Trigger asChild>
						<IconButton variant="ghost" size="sm">
							<Iconify icon="bx:filter" height="20" />
						</IconButton>
					</Menu.Trigger>
					<Portal>
						<Menu.Positioner>
							<Menu.Content minW="10rem">
								<Menu.RadioItemGroup
									value={sort}
									onValueChange={(item) => {
										if (isEmpty(item.value)) setBy('DESC')
										setSort(item.value)
									}}
								>
									<Menu.ItemGroupLabel textStyle="xs">Sort</Menu.ItemGroupLabel>
									<For each={sorts}>
										{(item) => (
											<Menu.RadioItem key={item.value} value={item.value}>
												<Menu.ItemIndicator />
												{item.label}
											</Menu.RadioItem>
										)}
									</For>
								</Menu.RadioItemGroup>
								<Show when={!isEmpty(sort)}>
									<Menu.RadioItemGroup value={by} onValueChange={(item) => setBy(item.value)}>
										<Menu.ItemGroupLabel textStyle="xs">By</Menu.ItemGroupLabel>
										<For each={bys}>
											{(item) => (
												<Menu.RadioItem key={item.value} value={item.value}>
													<Menu.ItemIndicator />
													{item.label}
												</Menu.RadioItem>
											)}
										</For>
									</Menu.RadioItemGroup>
								</Show>
								<Button
									size="sm"
									marginTop="4"
									colorPalette="primary"
									width="full"
									onClick={handleSortChange}
								>
									Apply
								</Button>
							</Menu.Content>
						</Menu.Positioner>
					</Portal>
				</Menu.Root>
			</Tooltip>
			<Tooltip content="Delete" showArrow>
				<IconButton variant="ghost" size="sm">
					<Iconify icon="bxs:trash" height="20" />
				</IconButton>
			</Tooltip>
			<Tooltip content="Custom View" showArrow>
				<IconButton asChild variant="ghost" size="sm">
					<Link href={customViewRoute}>
						<Iconify icon="fluent:data-usage-settings-24-regular" height="20" />
					</Link>
				</IconButton>
			</Tooltip>
		</Stack>
	)
}

const Component: React.FC<ComponentProps> = (props) => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()

	const queries = createQueryParams(
		{
			by: 'ASC',
			column: 'All',
			condition: props.navigation.default_custom_view_id ?? 'All',
			length: '5',
			sort: 'Default',
			start: '0'
		},
		{ route: pathname }
	)

	const handleAnimationDuration = (index: number) => {
		return (index + 1) * 200 + 'ms'
	}

	useEffect(() => {
		if (search.size < 5) router.replace(queries)
	}, [queries, router, search.size])

	return (
		<Card.Root
			width="full"
			animationName="slide-from-top, fade-in"
			animationDuration={handleAnimationDuration(props.index)}
		>
			<Card.Header>
				<Grid
					width="full"
					templateColumns={{ base: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
					gap="4"
				>
					<GridItem colSpan={{ base: 2, xl: 1 }}>
						<Stack direction="row">
							<Filter {...props} />
							<Group width="full" attached>
								<By {...props} />
								<Search {...props} />
							</Group>
						</Stack>
					</GridItem>
					<GridItem colSpan={1}>
						<Toolbar {...props} />
					</GridItem>
					<GridItem colSpan={1} placeItems="end">
						<Stack direction="row">
							<Button colorPalette="primary">
								<Iconify icon="bx:plus" height={20} style={{ color: 'white' }} />
								Create
							</Button>
						</Stack>
					</GridItem>
				</Grid>
			</Card.Header>
			<Card.Body>test</Card.Body>
			<Card.Footer>test</Card.Footer>
		</Card.Root>
	)
}

const DataTable: React.FC<DataTableProps> = (props) => {
	return (
		<For each={props.navigation}>
			{(item, index) => (
				<Component
					key={index}
					index={index}
					navigation={item}
					privilege={props.privilege[index]}
				/>
			)}
		</For>
	)
}

export default DataTable
