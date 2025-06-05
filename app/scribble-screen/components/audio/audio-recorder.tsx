import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { TrashIcon, PlayIcon, PauseIcon, ArrowRightIcon } from 'lucide-react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { Audio } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'
import RecordingVisualizer from './recording-visualizer'
import SpaceItemMenu from '../space-items/space-item-menu'
import SpaceItemContainer from '../space-items/space-item-container'

type AudioRecorderProps = {
	onClose: () => void
	onSendAudio?: (uri: string, duration: number, spaceItems: string[]) => void
	onSelectSpaceItem?: (item: string) => void
	spaceItems?: string[]
	onRemoveSpaceItem?: (item: string) => void
}

const formatDuration = (seconds: number) => {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function AudioRecorder({
	onClose,
	onSendAudio,
	onSelectSpaceItem,
	spaceItems = [],
	onRemoveSpaceItem,
}: AudioRecorderProps) {
	const { colors } = useTheme()
	const [recording, setRecording] = useState<Audio.Recording | null>(null)
	const [isPaused, setIsPaused] = useState(false)
	const [recordingDuration, setRecordingDuration] = useState(0)

	const initializeRecording = async () => {
		await Audio.requestPermissionsAsync()
		const newRecording = new Audio.Recording()
		await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
		await newRecording.startAsync()
		setRecording(newRecording)
	}

	useEffect(() => {
		initializeRecording()
		return () => {
			recording?.stopAndUnloadAsync()
		}
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			if (recording && !isPaused) {
				setRecordingDuration((prev) => prev + 1)
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [recording, isPaused])

	const handlePauseResume = async () => {
		if (!recording) return

		if (isPaused) {
			await recording.startAsync()
		} else {
			await recording.pauseAsync()
		}
		setIsPaused(!isPaused)
	}

	const handleCancel = async () => {
		if (!recording) return

		await recording.stopAndUnloadAsync()
		setRecording(null)
		onClose()
	}

	const handleSend = async () => {
		if (!recording) return

		await recording.stopAndUnloadAsync()
		const uri = recording.getURI()
		if (uri && onSendAudio) {
			onSendAudio(uri, recordingDuration, spaceItems)
		}
		onClose()
	}

	return (
		<View className="rounded-xl" style={{ backgroundColor: colors.border.light }}>
			<LinearGradient
				colors={colors.gradients.card.outer}
				start={{ x: 0.9, y: 0.5 }}
				end={{ x: 0.1, y: 0.5 }}
				className="rounded-xl overflow-hidden"
			>
				<LinearGradient
					colors={colors.gradients.card.inner}
					start={{ x: 0.9, y: 0.5 }}
					end={{ x: 0.1, y: 0.5 }}
					className="px-4 py-4 rounded-xl"
				>
					{spaceItems && spaceItems.length > 0 && (
						<SpaceItemContainer items={spaceItems} onRemove={onRemoveSpaceItem} />
					)}
					<View className="flex-row items-center justify-between mt-1">
						<View className="w-12 h-6 flex items-center justify-center">
							<Text className="text-base font-medium" style={{ color: colors.text.primary }}>
								{formatDuration(recordingDuration)}
							</Text>
						</View>
						<View className="flex-1">
							<RecordingVisualizer color={colors.text.secondary} />
						</View>
						<TouchableOpacity
							onPress={handleCancel}
							className="rounded-full h-10 w-10 flex items-center justify-center"
						>
							<TrashIcon size={20} color={colors.text.destructive} opacity={0.8} />
						</TouchableOpacity>
					</View>

					<View className="flex-row items-center justify-between py-2">
						{onSelectSpaceItem && <SpaceItemMenu onSelectSpaceItem={onSelectSpaceItem} />}

						<TouchableOpacity
							onPress={handlePauseResume}
							className="rounded-full h-10 w-10 flex items-center justify-center"
						>
							{isPaused ? (
								<PlayIcon size={20} color={colors.text.primary} opacity={0.8} />
							) : (
								<PauseIcon size={20} color={colors.text.primary} opacity={0.8} />
							)}
						</TouchableOpacity>

						<TouchableOpacity onPress={handleSend} className="rounded-full h-10 w-10 flex items-center justify-center">
							<ArrowRightIcon size={20} color={colors.text.primary} opacity={0.8} />
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</LinearGradient>
		</View>
	)
}
