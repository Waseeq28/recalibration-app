import React from 'react'
import { View, FlatList, Text } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import ScribbleCard from './scribble-card'
import { ScribbleGroup } from '@/lib/db/hooks/useScribbles'

type ScribbleListingProps = {
	scribbleGroups: ScribbleGroup[]
	isThreadReply?: boolean
	parentScribbleId?: string
}

type DateHeader = {
	type: 'header'
	date: string
}

type FlattenedItem = DateHeader | ScribbleGroup['scribbles'][0]

export default function ScribbleListing({ scribbleGroups, isThreadReply, parentScribbleId }: ScribbleListingProps) {
	const { colors } = useTheme()

	const renderDateHeader = (date: string) => (
		<View className="py-0.5 flex items-center">
			<View className="rounded-full overflow-hidden">
				<Text style={{ color: colors.text.secondary }} className="text-xs font-medium px-3 py-0.5">
					{date}
				</Text>
			</View>
		</View>
	)

	const flattenedData = scribbleGroups.reduce<FlattenedItem[]>((acc, group) => {
		acc.push({ type: 'header', date: group.date })
		return acc.concat(group.scribbles)
	}, [])

	if (scribbleGroups.length === 0) {
		return (
			<View style={{ backgroundColor: colors.background }} className="flex-1 justify-center items-center p-6">
				<Text style={{ color: colors.text.secondary }} className="text-xl text-center">
					No scribbles found.
				</Text>
			</View>
		)
	}

	return (
		<View style={{ backgroundColor: colors.background }} className="flex-1">
			<FlatList
				data={flattenedData}
				renderItem={({ item }) => {
					if ('type' in item && item.type === 'header') {
						return renderDateHeader(item.date)
					}

					const isParent = parentScribbleId && item.id === parentScribbleId

					return (
						<View>
							<ScribbleCard
								{...item}
								isThreadParent={Boolean(isParent)}
								isThreadReply={Boolean(!isParent && isThreadReply)}
							/>
						</View>
					)
				}}
				keyExtractor={(item) => ('type' in item && item.type === 'header' ? item.date : item.id)}
				className="w-full px-3"
				showsVerticalScrollIndicator={false}
				ItemSeparatorComponent={() => <View className="h-2" />}
				contentContainerStyle={{ paddingBottom: 16, paddingTop: 8 }}
			/>
		</View>
	)
}
