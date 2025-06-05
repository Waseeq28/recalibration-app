import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { useScribbleOperations, FilterType } from '@/lib/db/hooks/useScribbleOperations'

export default function ScribbleFilterTabs() {
	const { colors } = useTheme()
	const { currentFilter, setFilter } = useScribbleOperations()

	const handleFilterChange = (filter: FilterType) => {
		setFilter(filter)
	}

	return (
		<View className="flex-row rounded-full overflow-hidden" style={{ backgroundColor: colors.surface.secondary }}>
			<TouchableOpacity
				onPress={() => handleFilterChange('open')}
				style={{ backgroundColor: currentFilter === 'open' ? colors.text.accent : 'transparent' }}
				className="px-3 py-1"
			>
				<Text
					style={{
						color: currentFilter === 'open' ? '#fff' : colors.text.secondary,
						fontWeight: currentFilter === 'open' ? '600' : '400',
					}}
					className="text-sm"
				>
					Open
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => handleFilterChange('all')}
				style={{ backgroundColor: currentFilter === 'all' ? colors.text.accent : 'transparent' }}
				className="px-3 py-1"
			>
				<Text
					style={{
						color: currentFilter === 'all' ? '#fff' : colors.text.secondary,
						fontWeight: currentFilter === 'all' ? '600' : '400',
					}}
					className="text-sm"
				>
					All
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => handleFilterChange('archived')}
				style={{ backgroundColor: currentFilter === 'archived' ? colors.text.accent : 'transparent' }}
				className="px-3 py-1"
			>
				<Text
					style={{
						color: currentFilter === 'archived' ? '#fff' : colors.text.secondary,
						fontWeight: currentFilter === 'archived' ? '600' : '400',
					}}
					className="text-sm"
				>
					Archived
				</Text>
			</TouchableOpacity>
		</View>
	)
}
