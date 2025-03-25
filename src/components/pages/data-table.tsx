import {
	ActionBar,
	Button,
	Card,
	Center,
	Checkbox,
	createListCollection,
	EmptyState,
	Field,
	For,
	Grid,
	GridItem,
	Group,
	HStack,
	IconButton,
	Input,
	InputGroup,
	Menu,
	Portal,
	RadioCard,
	Select,
	SelectValueChangeDetails,
	Separator,
	Show,
	Spinner,
	Stack,
	Table,
	Tag,
	Text,
	useDisclosure
} from '@chakra-ui/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDebounce, useSelections, useSetState } from 'ahooks'
import { Case } from 'change-case-all'
import { groupBy, isEmpty } from 'lodash'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react'
import useGetRoute from '@/hooks/use-get-route'
import useIsCRUDPath from '@/hooks/use-is-crud-path'
import { CustomEndpoint, CustomEndpointProps } from '@/libraries/mutation/list'
import { GetFormatExportFile, GetTypeExportFile } from '@/libraries/mutation/parameter/dropdown'
import { GetLookupCustomView } from '@/libraries/mutation/user/common'
import useStaticStore from '@/stores/button-static'
import useModalStore from '@/stores/modal-dynamic'
import { ReglaResponse } from '@/types/default'
import { DownloadDataPayload, GetDataPayload } from '@/types/list'
import {
	GetNavigationScreenAction,
	GetNavigationScreenData,
	GetNavigationScreenDynamicForm
} from '@/types/user/common'
import { GetPrivilegeData } from '@/types/user/security-role'
import { crud_routes } from '@/utilities/constants'
import { createQueryParams, setQueryParams } from '@/utilities/helper'
import modal from '@/utilities/modal'
import { values } from '@/utilities/validation'
import Iconify from '../ui/iconify'
import Pagination, { PageChangeDetails } from '../ui/pagination'
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

type WithFormProps = ComponentProps & {
	form: (action: GetNavigationScreenAction) => GetNavigationScreenDynamicForm | undefined
}

type ToolbarProps = WithFormProps & {
	handleButtonClick: (action: GetNavigationScreenAction, row?: never) => void
}

type StaticModalProps = {
	data: GetNavigationScreenDynamicForm
	title: string
	row: never[]
	unique: string
}

type ListProps = WithFormProps & {
	rows: never[]
	selected: never[]
	isPending: boolean
	setSelected: Dispatch<SetStateAction<never[]>>
	handleButtonClick: (action: GetNavigationScreenAction, row?: never) => void
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
					<HStack alignItems="center">
						<Iconify icon="bx:customize" height={16} />
						<Select.ValueText width="fit" />
					</HStack>
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

const Toolbar: React.FC<ToolbarProps> = (props) => {
	const router = useRouter()
	const pathname = usePathname()
	const search = useSearchParams()
	const { open, setOpen } = useDisclosure()

	const [filter, setFilter] = useSetState({
		by: search.get('by') ?? '',
		sort: search.get('sort') ?? ''
	})

	const sorts = useMemo(() => {
		if (!props.navigation.map_column) return []

		return [
			{ label: 'Default', value: '' },
			...props.navigation.map_column.map((item) => ({
				label: item.value,
				value: item.object_name
			}))
		]
	}, [props.navigation])

	const bys = useMemo(() => {
		return [
			{ label: 'Descending', value: 'DESC' },
			{ label: 'Ascending', value: 'ASC' }
		]
	}, [])

	const handleSortChange = () => {
		setOpen(false)

		const queries = setQueryParams(search.toString(), filter, { route: pathname })
		router.replace(queries)
	}

	const download = useMemo(() => {
		return props.form('DOWNLOAD')
	}, [props])

	const custom = useMemo(() => {
		return props.form('CUSTOM_VIEW')
	}, [props])

	const customViewRoute = useMemo(() => {
		return isEmpty(custom) ? '' : [pathname, crud_routes.custom_view].join('')
	}, [custom, pathname])

	return (
		<HStack>
			<Tooltip content="Download" showArrow>
				<IconButton
					variant="ghost"
					size="sm"
					onClick={() => props.handleButtonClick('DOWNLOAD')}
					cursor={{ _disabled: 'not-allowed' }}
					disabled={isEmpty(download)}
				>
					<Iconify icon="bxs:download" height="20" />
				</IconButton>
			</Tooltip>
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
								value={filter.sort}
								onValueChange={(item) =>
									setFilter((state) => ({
										by: isEmpty(item.value) ? 'DESC' : state.by,
										sort: item.value
									}))
								}
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
							<Show when={!isEmpty(filter.sort)}>
								<Menu.RadioItemGroup
									value={filter.by}
									onValueChange={(item) => setFilter({ by: item.value })}
								>
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
			<Tooltip content="Custom View" showArrow>
				<IconButton
					asChild
					variant="ghost"
					size="sm"
					cursor={{ _disabled: 'not-allowed' }}
					disabled={isEmpty(custom)}
				>
					<Link href={customViewRoute} aria-disabled={isEmpty(custom)}>
						<Iconify icon="fluent:data-usage-settings-24-regular" height="20" />
					</Link>
				</IconButton>
			</Tooltip>
		</HStack>
	)
}

const ButtonAction: React.FC<WithFormProps> = ({ form }) => {
	const create = useMemo(() => {
		return form('CREATE')
	}, [form])

	return (
		<HStack flexDirection="row-reverse" justifyContent="space-between">
			<Show when={!isEmpty(create)}>
				<Button colorPalette="primary">
					<Iconify icon="bx:plus" height={20} style={{ color: 'white' }} />
					Create
				</Button>
			</Show>
		</HStack>
	)
}

const List: React.FC<ListProps> = (props) => {
	const {
		allSelected,
		isSelected,
		noneSelected,
		partiallySelected,
		selected,
		toggle,
		toggleAll
	} = useSelections(props.rows, { defaultSelected: props.selected })

	const list = useMemo(() => {
		return props.form('LIST')
	}, [props])

	const deactivate = useMemo(() => {
		return props.form('DEACTIVATE')
	}, [props])

	const erase = useMemo(() => {
		return props.form('DELETE')
	}, [props])

	const unique = useMemo(() => {
		return list ? list.unique_key : undefined
	}, [list])

	const columns = useMemo(() => {
		return props.navigation.map_column ? props.navigation.map_column : []
	}, [props.navigation])

	const keys = Object.entries(groupBy(columns, (item) => item.object_name))

	const checked = useMemo(() => {
		if (partiallySelected) return 'indeterminate'
		return allSelected
	}, [allSelected, partiallySelected])

	const setCustomColumn = (row: never, key: string) => {
		if (key.toLowerCase() !== 'status') return <Text>{row[key] || '-'}</Text>

		const passed = ['active', 'success', 'passed']
		const failed = ['failed', 'not passed']

		const isPassed = passed.includes(Case.lower(row[key]))
		const isFailed = failed.includes(Case.lower(row[key]))

		const palette = (isPassed && 'green') || (isFailed && 'red') || undefined

		return (
			<Tag.Root colorPalette={palette}>
				<Tag.Label>{row[key]}</Tag.Label>
			</Tag.Root>
		)
	}

	useEffect(() => {
		props.setSelected(selected)
	}, [props, selected])

	return (
		<Show
			when={!isEmpty(columns)}
			fallback={
				<EmptyState.Root>
					<EmptyState.Content>
						<EmptyState.Description>No Data Available</EmptyState.Description>
					</EmptyState.Content>
				</EmptyState.Root>
			}
		>
			<Show
				when={!props.isPending}
				fallback={
					<Center marginY="12">
						<Spinner size="xl" />
					</Center>
				}
			>
				<Table.ScrollArea borderWidth="1px">
					<Table.Root striped>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader backgroundColor="bg" position="sticky" left="0">
									<Checkbox.Root
										colorPalette="primary"
										checked={checked}
										onCheckedChange={() => toggleAll()}
									>
										<Checkbox.HiddenInput />
										<Checkbox.Control />
									</Checkbox.Root>
								</Table.ColumnHeader>
								<For each={columns}>
									{(item) => (
										<Table.ColumnHeader key={item.object_name} whiteSpace="nowrap">
											{item.value}
										</Table.ColumnHeader>
									)}
								</For>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Show when={!isEmpty(props.rows)}>
								<For each={props.rows}>
									{(row, index) => {
										const key = unique ? row[unique] : index
										const color = ~index & 1 ? 'bg.muted' : 'bg'

										return (
											<Menu.Root
												key={key}
												onSelect={({ value }) =>
													props.handleButtonClick(value as GetNavigationScreenAction, row)
												}
											>
												<Menu.ContextTrigger width="full" asChild>
													<Table.Row onClick={() => toggle(row)}>
														<Table.Cell backgroundColor={color} position="sticky" left="0">
															<Checkbox.Root
																colorPalette="primary"
																checked={isSelected(row)}
																onClick={() => toggle(row)}
															>
																<Checkbox.HiddenInput />
																<Checkbox.Control />
															</Checkbox.Root>
														</Table.Cell>
														<For each={keys}>
															{([key]) => (
																<Table.Cell key={crypto.randomUUID()} whiteSpace="nowrap">
																	{setCustomColumn(row, key)}
																</Table.Cell>
															)}
														</For>
													</Table.Row>
												</Menu.ContextTrigger>
												<Portal>
													<Menu.Positioner>
														<Menu.Content>
															<Menu.Item value="VIEW">
																<Text width="full">View</Text>
																<Iconify icon="bxs:show" height="16" />
															</Menu.Item>
															<Menu.Item value="UPDATE">
																<Text width="full">Update</Text>
																<Iconify icon="bxs:edit-alt" height="16" />
															</Menu.Item>
															<Menu.Item value="DEACTIVATE">
																<Text width="full">Deactivate</Text>
																<Iconify icon="bxs:minus-circle" height="16" />
															</Menu.Item>
															<Menu.Item value="DELETE">
																<Text width="full">Delete</Text>
																<Iconify icon="bxs:trash" height="16" />
															</Menu.Item>
														</Menu.Content>
													</Menu.Positioner>
												</Portal>
											</Menu.Root>
										)
									}}
								</For>
							</Show>
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
				<ActionBar.Root open={!noneSelected}>
					<Portal>
						<ActionBar.Positioner>
							<ActionBar.Content>
								<ActionBar.SelectionTrigger>
									{selected.length} selected
								</ActionBar.SelectionTrigger>
								<ActionBar.Separator />
								<Show when={selected.length === 1}>
									<Tooltip content="view" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('VIEW', selected[0])}
										>
											<Iconify icon="bxs:show" height="20" />
										</IconButton>
									</Tooltip>
								</Show>
								<Show when={selected.length === 1}>
									<Tooltip content="update" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('UPDATE', selected[0])}
										>
											<Iconify icon="bxs:edit-alt" height="20" />
										</IconButton>
									</Tooltip>
								</Show>
								<Show when={deactivate}>
									<Tooltip content="deactivate" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('DEACTIVATE')}
										>
											<Iconify icon="bxs:minus-circle" height="20" />
										</IconButton>
									</Tooltip>
								</Show>
								<Show when={erase}>
									<Tooltip content="delete" showArrow>
										<IconButton
											variant="ghost"
											onClick={() => props.handleButtonClick('DELETE')}
										>
											<Iconify icon="bxs:trash" height="20" />
										</IconButton>
									</Tooltip>
								</Show>
							</ActionBar.Content>
						</ActionBar.Positioner>
					</Portal>
				</ActionBar.Root>
			</Show>
		</Show>
	)
}

const Download: React.FC<StaticModalProps> = (props) => {
	const screenId = useGetRoute()
	const params = useSearchParams()

	const { setAttribute } = useModalStore()

	const [download, setDownload] = useSetState({ format: '', type: '' })

	const columnSearch = useMemo(() => {
		const column = params.get('column') ?? ''
		return column ? [column] : []
	}, [params])

	const customViewId = useMemo(() => {
		return params.get('condition') ?? ''
	}, [params])

	const length = useMemo(() => {
		return params.get('length') ?? '5'
	}, [params])

	const start = useMemo(() => {
		return params.get('start') ?? '0'
	}, [params])

	const sort = useMemo(() => {
		const sort = params.get('sort')
		const by = params.get('by')
		const isDefaultSort = sort === 'Default'

		if (sort && !isDefaultSort && by) {
			const field = sort === 'Default' ? '' : sort
			return [{ dir: by, field }]
		}

		return []
	}, [params])

	const search = useMemo(() => {
		return params.get('search') ?? ''
	}, [params])

	const queries = useMemo(
		() => ({
			columnSearch,
			customViewId,
			filter: { filters: [] },
			length,
			search,
			sort,
			start
		}),
		[columnSearch, customViewId, length, search, sort, start]
	)

	const type = useQuery({
		queryFn: GetTypeExportFile,
		queryKey: ['get_type_export_file']
	})

	const format = useQuery({
		queryFn: GetFormatExportFile,
		queryKey: ['get_format_export_file']
	})

	const { mutateAsync } = useMutation<
		ReglaResponse,
		Error,
		CustomEndpointProps<DownloadDataPayload>
	>({
		mutationFn: CustomEndpoint,
		mutationKey: ['list_export', screenId, search.toString()]
	})

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		mutateAsync({
			...props.data,
			...queries,
			[props.unique]: download.type === 'Selected' ? props.row : [],
			format: download.format,
			type: download.type
		}).finally(() => modal.close())
	}

	useEffect(() => {
		setAttribute('submit', { disabled: isEmpty(download.format) || isEmpty(download.type) })
	}, [download.format, download.type, setAttribute])

	return (
		<Stack id="submit-form" as="form" gap="8" onSubmit={handleSubmit}>
			<RadioCard.Root
				colorPalette="primary"
				onValueChange={({ value }) => setDownload({ type: value })}
			>
				<RadioCard.Label>File Type</RadioCard.Label>
				<Stack align="stretch">
					<Show when={!type.isPending}>
						<For each={type.data?.data}>
							{(item) => (
								<RadioCard.Item
									key={item.id}
									value={item.id.toString()}
									disabled={item.id === 'Selected' && props.row.length < 1}
								>
									<RadioCard.ItemHiddenInput />
									<RadioCard.ItemControl>
										<RadioCard.ItemText>
											{item.desc} {item.id === 'Selected' && `(${props.row.length})`}
										</RadioCard.ItemText>
										<RadioCard.ItemIndicator />
									</RadioCard.ItemControl>
								</RadioCard.Item>
							)}
						</For>
					</Show>
				</Stack>
			</RadioCard.Root>
			<RadioCard.Root
				colorPalette="primary"
				orientation="horizontal"
				align="center"
				justify="center"
				onValueChange={({ value }) => setDownload({ format: value })}
			>
				<RadioCard.Label>File Format</RadioCard.Label>
				<HStack>
					<Show when={!format.isPending}>
						<For each={format.data?.data}>
							{(item) => (
								<RadioCard.Item key={item.id} value={item.id.toString()}>
									<RadioCard.ItemHiddenInput />
									<RadioCard.ItemControl>
										<RadioCard.ItemText>{item.desc}</RadioCard.ItemText>
									</RadioCard.ItemControl>
								</RadioCard.Item>
							)}
						</For>
					</Show>
				</HStack>
			</RadioCard.Root>
		</Stack>
	)
}

const Component: React.FC<ComponentProps> = (props) => {
	const router = useRouter()
	const pathname = usePathname()
	const params = useSearchParams()
	const screenId = useGetRoute()
	const isCRUDPath = useIsCRUDPath()

	const { setAttribute } = useModalStore()
	const { getTitle } = useStaticStore()

	const { data, isPending, mutateAsync } = useMutation<
		ReglaResponse<never[]>,
		Error,
		CustomEndpointProps<GetDataPayload>
	>({
		mutationFn: CustomEndpoint,
		mutationKey: ['list', screenId, params.toString()]
	})

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

	const columnSearch = useMemo(() => {
		const value = params.get('column')
		if (value === 'All') return []
		return value ? [value] : []
	}, [params])

	const customViewId = useMemo(() => {
		const value = params.get('condition')
		if (value === 'All') return ''
		return value ? value : ''
	}, [params])

	const length = useMemo(() => {
		const value = params.get('length')
		return value ? Number(value) : values.length
	}, [params])

	const start = useMemo(() => {
		const value = params.get('start')
		return value ? Number(value) : values.start
	}, [params])

	const search = useMemo(() => {
		const value = params.get('search')
		return value ? value : ''
	}, [params])

	const sort = useMemo(() => {
		const sort = params.get('sort')
		const by = params.get('by')
		const isDefaultSort = sort === 'Default'

		if (sort && !isDefaultSort && by) {
			const field = sort === 'Default' ? '' : sort
			return [{ dir: by, field }]
		}

		return []
	}, [params])

	const recordsTotal = useMemo(() => {
		return data ? data.recordsTotal : 0
	}, [data])

	const rows = useMemo(() => {
		return (data && data.data) || []
	}, [data])

	const { clearAll, selected, setSelected } = useSelections(rows)

	const handleAnimationDuration = (index: number) => {
		return (index + 1) * 200 + 'ms'
	}

	const form = useCallback(
		(action: GetNavigationScreenAction) => {
			if (props.navigation.dynamic_form) {
				const data = props.navigation.dynamic_form.find((item) => item.action === action)
				return data
			}

			return undefined
		},
		[props.navigation.dynamic_form]
	)

	const list = useMemo(() => {
		return form('LIST')
	}, [form])

	const handleButtonClick = (action: GetNavigationScreenAction, row?: never) => {
		const data = form(action)

		if (data) {
			const title = [Case.capital(data.action), getTitle()].join(' ')
			const route = [pathname, '/', data.action.toLowerCase()].join('')

			if (data.is_modal) {
				switch (data.action) {
					case 'DOWNLOAD':
						return handleDownloadModal(data, title)
					case 'DEACTIVATE':
					case 'DELETE':
						return handleDangerousModal(data, title, row)
				}
			}

			if (row) {
				const queries = createQueryParams(
					{ [data.unique_key]: row[data.unique_key] },
					{ route }
				)

				return router.push(queries)
			}
		}
	}

	const handleDownloadModal = (
		data: GetNavigationScreenDynamicForm,
		title: string,
		row?: never
	) => {
		const list = row ? [row] : selected
		const unique = list.map((item) => item[data.unique_key])

		modal.create({
			children: <Download data={data} title={title} row={unique} unique={data.unique_key} />,
			options: { size: 'lg', submit: { disabled: true, title: 'Download' }, title }
		})
	}

	const handleDangerousModal = (
		data: GetNavigationScreenDynamicForm,
		title: string,
		row?: never
	) => {
		const list = row ? [row] : selected
		const unique = list.map((item) => item[data.unique_key])

		modal.create({
			children: (
				<Center paddingY="12">
					Are you sure you want to {Case.lower(data.action)} the selected record(s)?
				</Center>
			),
			options: {
				submit: {
					colorPalette: 'red',
					onClick: () => {
						setAttribute('submit', { loading: true })
						CustomEndpoint({ [data.unique_key]: unique, ...data })
							.then(() => router.replace(setQueryParams(search.toString(), { start: '0' })))
							.catch((error) => error)
							.finally(() => {
								setAttribute('submit', { loading: false })
								modal.close()
							})
					},
					title: Case.capital(data.action)
				},
				title
			}
		})
	}

	const handlePaginationChange = (value: PageChangeDetails) => {
		const queries = setQueryParams(
			params.toString(),
			{
				length: value.pageSize.toString(),
				start: (value.page - 1).toString()
			},
			{ route: pathname }
		)

		router.replace(queries)
	}

	const payload = useMemo((): GetDataPayload => {
		return {
			columnSearch,
			customViewId,
			filter: { filters: [] },
			length,
			search,
			sort,
			start
		}
	}, [columnSearch, customViewId, length, search, sort, start])

	useEffect(() => {
		if (params.size <= 0 && !isCRUDPath) router.replace(queries)
	}, [isCRUDPath, queries, router, params.size])

	useEffect(() => {
		if (!isEmpty(list) && params.size > 0) mutateAsync({ ...payload, ...list })
		clearAll()
	}, [clearAll, list, mutateAsync, params.size, payload])

	return (
		<Card.Root
			width="full"
			animationName="slide-from-top, fade-in"
			animationDuration={handleAnimationDuration(props.index)}
		>
			<Card.Header>
				<Grid
					width="full"
					autoColumns={{ base: 'auto', xl: 'min-content' }}
					templateColumns={{ xl: 'min-content min-content auto' }}
					autoFlow={{ base: 'row', xl: 'column' }}
					gap="4"
				>
					<GridItem colSpan={{ base: 4, xl: 1 }}>
						<HStack>
							<Filter {...props} />
							<Group width="full" attached>
								<By {...props} />
								<Search {...props} />
							</Group>
						</HStack>
					</GridItem>
					<GridItem colSpan={1} rowStart={{ base: 2, xl: 'auto' }}>
						<Toolbar form={form} handleButtonClick={handleButtonClick} {...props} />
					</GridItem>
					<GridItem colSpan={{ base: 3, xl: 1 }} rowStart={{ base: 2, xl: 'auto' }}>
						<ButtonAction form={form} {...props} />
					</GridItem>
				</Grid>
			</Card.Header>
			<Card.Body>
				<List
					key={rows.toString()}
					form={form}
					rows={rows}
					selected={selected}
					setSelected={setSelected}
					handleButtonClick={handleButtonClick}
					isPending={isPending}
					{...props}
				/>
			</Card.Body>
			<Card.Footer alignSelf="end">
				<Pagination
					length={length}
					start={start}
					recordsTotal={recordsTotal}
					onPageChange={handlePaginationChange}
				/>
			</Card.Footer>
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
