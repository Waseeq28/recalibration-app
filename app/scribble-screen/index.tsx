import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import ScribblesInput from './scribble-input'
import ScribbleListing from './scribble-listing'
import { useScribbles } from '@/lib/db/hooks/useScribbles'
import { useScribbleOperations } from '@/lib/db/hooks/useScribbleOperations'
import { router } from 'expo-router'

const AI_RESPONSE = "I'm your AI assistant. How can I help you today?"

export default function ScribblesScreen() {
	const { colors } = useTheme()
	const { scribbleGroups, isLoading } = useScribbles()
	const { addScribble } = useScribbleOperations()

	const handleSendText = async (content: string, spaceItems: string[] = [], isAiEnabled: boolean = false) => {
		const scribbleId = await addScribble('text', content, {
			spaceItems: spaceItems.length > 0 ? spaceItems : undefined,
			isAiEnabled,
		})

		if (isAiEnabled && scribbleId) {
			await addScribble('text', AI_RESPONSE, {
				parentId: scribbleId,
				isAiEnabled: true,
				isAiGenerated: true,
			})

			router.push(`/scribble-screen/scribble-thread?scribbleId=${scribbleId}`)
		}
	}

	const handleSendImage = async (imageUri: string, caption?: string, isAiEnabled?: boolean, spaceItems?: string[]) => {
		const scribbleId = await addScribble('image', imageUri, {
			caption,
			spaceItems: spaceItems?.length ? spaceItems : undefined,
			isAiEnabled,
		})

		if (isAiEnabled && scribbleId) {
			await addScribble('text', AI_RESPONSE, {
				parentId: scribbleId,
				isAiEnabled: true,
				isAiGenerated: true,
			})

			router.push(`/scribble-screen/scribble-thread?scribbleId=${scribbleId}`)
		}
	}

	const handleSendAudio = async (uri: string, duration: number, spaceItems: string[] = [], isAiEnabled?: boolean) => {
		const scribbleId = await addScribble('audio', uri, {
			duration,
			spaceItems: spaceItems.length > 0 ? spaceItems : undefined,
			isAiEnabled,
			transcription: {
				status: 'processing',
			},
		})

		if (isAiEnabled && scribbleId) {
			await addScribble('text', AI_RESPONSE, {
				parentId: scribbleId,
				isAiEnabled: true,
				isAiGenerated: true,
			})

			router.push(`/scribble-screen/scribble-thread?scribbleId=${scribbleId}`)
		}
	}

	return (
		<View style={{ backgroundColor: colors.background }} className="flex-1">
			{isLoading ? (
				<ActivityIndicator size="large" color={colors.text.accent} style={{ marginTop: 20 }} />
			) : (
				<ScribbleListing scribbleGroups={scribbleGroups} />
			)}
			<ScribblesInput onSendScribble={handleSendText} onSendImage={handleSendImage} onSendAudio={handleSendAudio} />
		</View>
	)
}
