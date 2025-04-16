import {
	Box,
	Center,
	EmptyState,
	For,
	Heading,
	HStack,
	Link,
	Separator,
	Show,
	Spinner,
	Stack,
	Text
} from '@chakra-ui/react'
import { Iconify, Search } from '@regla/monorepo'
import { useMutation } from '@tanstack/react-query'
import { useDebounceFn } from 'ahooks'
import { isEmpty } from 'lodash'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import useGetAppId from '@/hooks/use-get-app-id'
import { GeneralSearch, GeneralSearchModule } from '@/libraries/mutation/parameter/parameter'
import { routes } from '@/utilities/constants'
import { setQueryParams } from '@/utilities/helper'

const Empty = () => (
	<EmptyState.Root size="sm">
		<EmptyState.Content>
			<EmptyState.Indicator>
				<Iconify icon="flat-color-icons:about" />
			</EmptyState.Indicator>
			<EmptyState.Title textStyle="xs">Record is Empty</EmptyState.Title>
		</EmptyState.Content>
	</EmptyState.Root>
)

const Header = () => {
	const router = useRouter()
	const pathname = usePathname()
	const params = useSearchParams()
	const appId = useGetAppId()

	const {
		data: module,
		isPending: isModuleLoading,
		mutateAsync: generalSearch
	} = useMutation({
		mutationFn: GeneralSearch,
		mutationKey: ['general_search']
	})

	const {
		data: submodule,
		isPending: isSubmoduleLoading,
		mutateAsync: generalSearchModule
	} = useMutation({
		mutationFn: GeneralSearchModule,
		mutationKey: ['general_search_module']
	})

	const { run: handleValueChange } = useDebounceFn(
		(search) => {
			if (search) {
				generalSearch({ search })
				generalSearchModule({ search })
			}

			const queries = setQueryParams(params.toString(), { path: search }, { route: pathname })
			router.replace(queries)
		},
		{ wait: 500 }
	)

	const value = useMemo(() => {
		return params.get('path') ?? undefined
	}, [params])

	const moduleList = useMemo(() => {
		return module?.data.list || []
	}, [module?.data.list])

	const submoduleList = useMemo(() => {
		return submodule?.data.list || []
	}, [submodule?.data.list])

	const route = useMemo(() => {
		const route = [appId, routes.search].join('/')
		return `/${route}${location.search}`
	}, [appId])

	useEffect(() => {
		if (params.get('path')) handleValueChange(params.get('path'))
	}, [handleValueChange, params])

	return (
		<HStack>
			<Search defaultValue={value} onValueChange={handleValueChange}>
				<Stack gap="0">
					<Box padding="4">
						<Heading textStyle="xs">Record(s)</Heading>
					</Box>
					<Separator />
					<Box maxHeight="48" overflowX="auto" width="full">
						<Show
							when={!isModuleLoading}
							fallback={
								<Center marginY="4">
									<Spinner color="primary.fg" />
								</Center>
							}
						>
							<Show fallback={<Empty />} when={!isEmpty(moduleList)}>
								<For each={moduleList}>
									{(item, index) => (
										<Link
											key={index}
											_hover={{ backgroundColor: 'bg.muted' }}
											href={item.redirect_url}
											width="full"
											truncate
										>
											<Stack gap="1" padding="4" textStyle="xs" width="full">
												<Text
													color="primary.fg"
													fontWeight="semibold"
													marginBottom="1"
													textStyle="sm"
													truncate
												>
													{item.model_name}
												</Text>
												<Text truncate>{item.path}</Text>
												<Text truncate>{item.record_name}</Text>
											</Stack>
										</Link>
									)}
								</For>
							</Show>
						</Show>
					</Box>
					<Separator />
					<Box padding="4">
						<Heading textStyle="xs">Module(s)/Sub-Module(s)</Heading>
					</Box>
					<Separator />
					<Box maxHeight="48" overflowX="auto" width="full">
						<Show
							when={!isSubmoduleLoading}
							fallback={
								<Center marginY="4">
									<Spinner color="primary.fg" />
								</Center>
							}
						>
							<Show fallback={<Empty />} when={!isEmpty(submoduleList)}>
								<For each={submoduleList}>
									{(item, index) => (
										<Link
											key={index}
											_hover={{ backgroundColor: 'bg.muted' }}
											href={item.redirect_url}
											width="full"
											truncate
										>
											<Stack gap="1" padding="4" textStyle="xs" width="full">
												<Text
													color="primary.fg"
													fontWeight="semibold"
													marginBottom="1"
													textStyle="sm"
													truncate
												>
													{item.model_name}
												</Text>
												<Text truncate>{item.path}</Text>
											</Stack>
										</Link>
									)}
								</For>
							</Show>
						</Show>
					</Box>
					<Separator />
					<Center padding="4">
						<Link colorPalette="primary" href={route} textStyle="xs">
							See all results
						</Link>
					</Center>
				</Stack>
			</Search>
		</HStack>
	)
}

export default Header
