import { Box, BoxProps } from '@chakra-ui/react'
import { Icon, IconifyIconHTMLElement, IconifyIconProps } from '@iconify-icon/react'
import { forwardRef } from 'react'

type IconifyProps = BoxProps & IconifyIconProps

const Iconify = forwardRef<IconifyIconHTMLElement, IconifyProps>((props, ref) => {
	const height = props.height ? Number(props.height) / 4 : ''

	return (
		<Box
			_light={{ color: 'gray.600' }}
			_dark={{ color: 'gray.300' }}
			{...props}
			height={height}
		>
			<Icon ref={ref} {...props} />
		</Box>
	)
})

Iconify.displayName = 'Iconify'

export default Iconify
