import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { XIcon } from 'lucide-react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { colors as themeConstants } from '@/constants/theme'

type SpaceItemContainerProps = {
	items: string[]
	onRemove?: (item: string) => void
	className?: string
	darkMode?: boolean
}

export default function SpaceItemContainer({ items, onRemove, className = '', darkMode }: SpaceItemContainerProps) {
	const { colors } = useTheme()
	const activeColors = darkMode ? themeConstants.dark : colors

	if (!items?.length) return null

	return (
		<View className={`flex-row flex-wrap gap-3 py-1 ${className}`}>
			{items.map((item) => (
				<View
					key={item}
					className="rounded-md px-2 py-1 flex-row items-center"
					style={{ backgroundColor: activeColors.surface.tag }}
				>
					<Text className="text-xs font-medium" style={{ color: activeColors.text.accent }}>
						{item}
					</Text>
					{onRemove && (
						<TouchableOpacity onPress={() => onRemove(item)} className="ml-1">
							<XIcon size={14} color={activeColors.text.accent} />
						</TouchableOpacity>
					)}
				</View>
			))}
		</View>
	)
}
