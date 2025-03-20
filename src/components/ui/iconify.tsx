import { Box } from '@chakra-ui/react'
import { Icon, IconifyIconHTMLElement, IconifyIconProps } from '@iconify-icon/react'
import { forwardRef } from 'react'

const Iconify = forwardRef<IconifyIconHTMLElement, IconifyIconProps>((props, ref) => {
	const height = props.height ? Number(props.height) / 4 : 'auto'

	return (
		<Box _light={{ color: 'gray.600' }} _dark={{ color: 'gray.300' }} height={height}>
			<Icon ref={ref} {...props} />
		</Box>
	)
})

Iconify.displayName = 'Iconify'

export default Iconify
