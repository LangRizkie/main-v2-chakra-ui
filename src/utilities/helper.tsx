import { isEmpty } from 'lodash'
import Image from 'next/image'
import { CSSProperties } from 'react'
import Iconify from '../components/ui/iconify'

type CreateQueryParamsOption = {
	route: string
}

type GenerateIconProps = {
	size?: number
	style?: CSSProperties
	icon: string
}

const createQueryParams = (
	data: string[][] | Record<string, string> | string | URLSearchParams,
	option?: Partial<CreateQueryParamsOption>
) => {
	const search = new URLSearchParams(data)
	const route = option && option.route ? option.route : ''
	return route + '?' + search.toString()
}

const setQueryParams = (
	data: string[][] | Record<string, string> | string | URLSearchParams,
	value: Record<string, string>,
	option?: Partial<CreateQueryParamsOption>
) => {
	const search = new URLSearchParams(data)
	const keys = Object.keys(value)
	const values = Object.values(value)
	const route = option && option.route ? option.route : ''

	keys.map((key, index) => {
		if (isEmpty(values[index])) return search.delete(key)
		search.set(key, values[index])
	})

	return route + '?' + search.toString()
}

const GenerateIcon = ({ size = 14, ...props }: GenerateIconProps) => {
	if (!props.icon.startsWith('https://'))
		return <Iconify icon={props.icon} height={size} style={props.style} />

	return (
		<Image
			src={props.icon}
			alt={crypto.randomUUID()}
			width={size}
			height={size}
			style={{ height: size, minHeight: size, minWidth: size, width: size }}
		/>
	)
}

export { createQueryParams, GenerateIcon, setQueryParams }
