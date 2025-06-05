import React from 'react'
import { View } from 'react-native'

type RecordingVisualizerProps = {
	color: string
}

export default function RecordingVisualizer({ color }: RecordingVisualizerProps) {
	return (
		<View className="flex-1 h-6 flex-row items-center justify-evenly ml-1">
			{[...Array(40)].map((_, i) => (
				<View key={i} className="h-[2px] w-[2px] rounded-full" style={{ backgroundColor: color, opacity: 0.5 }} />
			))}
		</View>
	)
}
