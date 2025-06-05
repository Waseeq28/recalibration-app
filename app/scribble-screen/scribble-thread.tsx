import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useTheme } from '@/contexts/ThemeContext'
import ScribblesInput from './scribble-input'
import ScribbleListing from './scribble-listing'
import { useScribbles } from '@/lib/db/hooks/useScribbles'
import { useScribbleOperations } from '@/lib/db/hooks/useScribbleOperations'
import { Scribble } from '@/lib/db/schemas/scribble.schema'

const AI_RESPONSE = "I'm your AI assistant. How can I help you today?"

export default function ScribbleThread() {
	const { colors } = useTheme()
	const { scribbleId } = useLocalSearchParams<{ scribbleId: string }>()
	const [parentScribble, setParentScribble] = useState<Scribble | null>(null)
	const [isLoadingParent, setIsLoadingParent] = useState(true)
	const { scribbleGroups, isLoading } = useScribbles(scribbleId)
	const { getScribbleById, addScribble, isLoading: isOperationsLoading } = useScribbleOperations()
	const [aiInitiallyEnabled, setAiInitiallyEnabled] = useState(false)

	useEffect(() => {
		let isMounted = true
		const loadParent = async () => {
			if (!scribbleId) return
			setIsLoadingParent(true)
			const scribble = await getScribbleById(scribbleId)
			if (isMounted && scribble) {
				setParentScribble(scribble)
				setAiInitiallyEnabled(Boolean(scribble.isAiEnabled))
				setIsLoadingParent(false)
			}
		}
		loadParent()
		return () => {
			isMounted = false
		}
	}, [scribbleId, getScribbleById])

	const generateAiResponse = useCallback(
		(isAiEnabled: boolean) => {
			if (!isAiEnabled || !scribbleId) return

			addScribble('text', AI_RESPONSE, {
				parentId: scribbleId,
				isAiEnabled: true,
				isAiGenerated: true,
			})
		},
		[addScribble, scribbleId],
	)

	const handleSendText = useCallback(
		(content: string, spaceItems: string[] = [], isAiEnabled: boolean = false) => {
			if (!scribbleId) return
			addScribble('text', content, {
				spaceItems: spaceItems.length > 0 ? spaceItems : undefined,
				parentId: scribbleId,
				isAiEnabled,
			})

			generateAiResponse(isAiEnabled)
		},
		[addScribble, scribbleId, generateAiResponse],
	)

	const handleSendImage = useCallback(
		(imageUri: string, caption?: string, isAiEnabled?: boolean) => {
			if (!scribbleId) return
			addScribble('image', imageUri, {
				caption,
				parentId: scribbleId,
				isAiEnabled,
			})

			generateAiResponse(Boolean(isAiEnabled))
		},
		[addScribble, scribbleId, generateAiResponse],
	)

	const handleSendAudio = useCallback(
		(uri: string, duration: number, spaceItems: string[] = [], isAiEnabled?: boolean) => {
			if (!scribbleId) return
			addScribble('audio', uri, {
				duration,
				spaceItems: spaceItems.length > 0 ? spaceItems : undefined,
				parentId: scribbleId,
				isAiEnabled,
				transcription: {
					status: 'processing',
				},
			})

			generateAiResponse(Boolean(isAiEnabled))
		},
		[addScribble, scribbleId, generateAiResponse],
	)

	if (isLoadingParent || isLoading || isOperationsLoading) {
		return (
			<View style={{ backgroundColor: colors.background }} className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color={colors.text.accent} />
			</View>
		)
	}

	if (!parentScribble) {
		return (
			<View style={{ backgroundColor: colors.background }} className="flex-1 items-center justify-center">
				<Text style={{ color: colors.text.primary }}>Scribble not found</Text>
			</View>
		)
	}

	return (
		<View style={{ backgroundColor: colors.background }} className="flex-1">
			<View className="flex-1">
				<ScribbleListing scribbleGroups={scribbleGroups} isThreadReply={true} parentScribbleId={parentScribble.id} />
			</View>
			<ScribblesInput
				onSendScribble={handleSendText}
				onSendImage={handleSendImage}
				onSendAudio={handleSendAudio}
				initialAiEnabled={aiInitiallyEnabled}
			/>
		</View>
	)
}
