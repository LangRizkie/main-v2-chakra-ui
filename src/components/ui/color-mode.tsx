'use client'

import type { SpanProps, SwitchRootProps } from '@chakra-ui/react'
import { Span, Switch } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { useColorMode } from '../../hooks/use-color-mode'
import Iconify from './iconify'

export type ColorSwitchProps = Omit<SwitchRootProps, 'aria-label'>

export const ColorModeIcon = () => {
	const { colorMode } = useColorMode()
	const icon = colorMode === 'dark' ? 'bx:moon' : 'bx:sun'

	return <Iconify icon={icon} />
}

const ColorModeButton = forwardRef<HTMLLabelElement, ColorSwitchProps>(
	function ColorModeButton(props, ref) {
		const { colorMode, toggleColorMode } = useColorMode()

		return (
			<Switch.Root
				ref={ref}
				colorPalette="primary"
				aria-label="Toggle color mode"
				checked={colorMode === 'dark'}
				onCheckedChange={toggleColorMode}
				{...props}
			>
				<Switch.HiddenInput />
				<Switch.Control />
			</Switch.Root>
		)
	}
)

const LightMode = forwardRef<HTMLSpanElement, SpanProps>(function LightMode(props, ref) {
	return (
		<Span
			color="fg"
			display="contents"
			className="chakra-theme light"
			colorPalette="gray"
			colorScheme="light"
			ref={ref}
			{...props}
		/>
	)
})

const DarkMode = forwardRef<HTMLSpanElement, SpanProps>(function DarkMode(props, ref) {
	return (
		<Span
			color="fg"
			display="contents"
			className="chakra-theme dark"
			colorPalette="gray"
			colorScheme="dark"
			ref={ref}
			{...props}
		/>
	)
})

export { ColorModeButton, DarkMode, LightMode }
