import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import SpaceItemContainer from '../space-items/space-item-container'
import { Scribble } from '@/lib/db/schemas/scribble.schema'

interface TextCardProps extends Pick<Scribble, 'content' | 'spaceItems'> {}

export default function TextCard({ content, spaceItems }: TextCardProps) {
	const { colors } = useTheme()

	if (!content) return null

	return (
		<View className="px-3 pt-3">
			<SpaceItemContainer items={spaceItems || []} />
			<View className="mb-2">
				<Text className="leading-6" style={{ color: colors.text.primary }}>
					{content}
				</Text>
			</View>
		</View>
	)
}
