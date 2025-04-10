import { Portal, Show, Tooltip as ChakraTooltip } from '@chakra-ui/react'
import { forwardRef } from 'react'

type TooltipProps = ChakraTooltip.RootProps & {
	showArrow?: boolean
	portalled?: boolean
	portalRef?: React.RefObject<HTMLElement>
	content: React.ReactNode
	contentProps?: ChakraTooltip.ContentProps
	disabled?: boolean
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
	const {
		children,
		content,
		contentProps,
		disabled,
		openDelay = 200,
		portalled = true,
		portalRef,
		showArrow,
		...rest
	} = props

	if (disabled) return children

	return (
		<ChakraTooltip.Root openDelay={openDelay} {...rest}>
			<ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
			<Portal container={portalRef} disabled={!portalled}>
				<ChakraTooltip.Positioner>
					<ChakraTooltip.Content ref={ref} {...contentProps}>
						<Show when={showArrow}>
							<ChakraTooltip.Arrow>
								<ChakraTooltip.ArrowTip />
							</ChakraTooltip.Arrow>
						</Show>
						{content}
					</ChakraTooltip.Content>
				</ChakraTooltip.Positioner>
			</Portal>
		</ChakraTooltip.Root>
	)
})

export default Tooltip
