import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { PlayIcon, PauseIcon } from 'lucide-react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { Audio } from 'expo-av'
import SpaceItemContainer from '../space-items/space-item-container'
import { Scribble } from '@/lib/db/schemas/scribble.schema'

interface AudioCardProps extends Pick<Scribble, 'content' | 'duration' | 'spaceItems'> {
	transcription?: {
		status: 'completed' | 'processing'
		text?: string
	}
}

const formatDuration = (seconds: number) => {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function AudioCard({ content, duration, transcription, spaceItems }: AudioCardProps) {
	const { colors } = useTheme()

	const [sound, setSound] = useState<Audio.Sound | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [playbackPosition, setPlaybackPosition] = useState(0)
	const [progressBarWidth, setProgressBarWidth] = useState(0)
	const [isSeeking, setIsSeeking] = useState(false)
	const [seekTime, setSeekTime] = useState(0)

	useEffect(() => {
		return () => {
			sound?.unloadAsync()
		}
	}, [sound])

	const onPlaybackStatusUpdate = (status: any) => {
		if (!status.isLoaded) return

		setPlaybackPosition(status.positionMillis / (status.durationMillis || 1))
		setCurrentTime(Math.floor(status.positionMillis / 1000))

		if (status.didJustFinish) {
			setIsPlaying(false)
			setPlaybackPosition(0)
			setCurrentTime(0)
		}
	}

	const initializeAudio = async () => {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			playsInSilentModeIOS: true,
			staysActiveInBackground: true,
			shouldDuckAndroid: true,
		})

		const { sound: newSound } = await Audio.Sound.createAsync(
			{ uri: content! },
			{ progressUpdateIntervalMillis: 100 },
			onPlaybackStatusUpdate,
		)

		setSound(newSound)
		return newSound
	}

	const handlePlayPause = async () => {
		if (!content) return

		if (isPlaying) {
			await sound?.pauseAsync()
			setIsPlaying(false)
			return
		}

		if (sound) {
			await sound.playAsync()
			setIsPlaying(true)
			return
		}

		const newSound = await initializeAudio()
		await newSound.playAsync()
		setIsPlaying(true)
	}

	const handleSeek = async (position: number) => {
		if (!sound || !progressBarWidth) return

		const clampedPosition = Math.max(0, Math.min(1, position))

		const status = await sound.getStatusAsync()
		if (!status.isLoaded) return

		const newPosition = clampedPosition * status.durationMillis!
		setPlaybackPosition(clampedPosition)
		await sound.setPositionAsync(Math.floor(newPosition))

		if (isPlaying) {
			await sound.playAsync()
		}
	}

	const handleSeekStart = (event: any) => {
		if (!sound || !progressBarWidth || !duration) return

		setIsSeeking(true)
		const position = event.nativeEvent.locationX / progressBarWidth
		setSeekTime(Math.floor(position * duration))
	}

	const handleSeekComplete = async (event: any) => {
		if (!sound || !progressBarWidth) return

		const position = event.nativeEvent.locationX / progressBarWidth
		await handleSeek(position)
		setIsSeeking(false)
	}

	const getDurationDisplay = () => {
		if (isSeeking) return formatDuration(seekTime)
		if (isPlaying || currentTime > 0) return formatDuration(currentTime)
		return duration ? formatDuration(duration) : '0:00'
	}

	return (
		<View className="mb-2 w-72 px-4 pt-4">
			<SpaceItemContainer items={spaceItems || []} />
			<View className="flex-row items-center pt-2">
				<TouchableOpacity onPress={handlePlayPause}>
					{isPlaying ? (
						<PauseIcon size={22} color={colors.text.primary} />
					) : (
						<PlayIcon size={22} color={colors.text.primary} />
					)}
				</TouchableOpacity>

				<View
					className="flex-1 mx-4 py-2"
					onLayout={(e) => setProgressBarWidth(e.nativeEvent.layout.width)}
					onTouchStart={handleSeekStart}
					onTouchEnd={handleSeekComplete}
				>
					<View className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.text.tertiary }}>
						<View
							className="h-full"
							style={{
								backgroundColor: colors.text.secondary,
								width: `${playbackPosition * 100}%`,
							}}
						/>
					</View>
				</View>

				<Text style={{ color: colors.text.primary }} className="text-sm">
					{getDurationDisplay()}
				</Text>
			</View>

			{transcription?.status === 'completed' && transcription.text && (
				<Text style={{ color: colors.text.primary }} className="text-sm mt-3 italic">
					{transcription.text}
				</Text>
			)}
		</View>
	)
}
