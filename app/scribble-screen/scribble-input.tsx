import React, { useState, useEffect } from 'react'
import { TextInput, TouchableOpacity, View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '@/contexts/ThemeContext'
import ImagePickerButton from './components/image/image-picker-modal'
import AudioRecorder from './components/audio/audio-recorder'
import { ArrowRightIcon, MicIcon } from 'lucide-react-native'
import SpaceItemMenu from './components/space-items/space-item-menu'
import SpaceItemContainer from './components/space-items/space-item-container'

type ScribblesInputProps = {
	onSendScribble: (content: string, spaceItems: string[], isAiEnabled: boolean) => void
	onSendImage?: (uri: string, caption?: string, isAiEnabled?: boolean) => void
	onSendAudio?: (uri: string, duration: number, spaceItems: string[], isAiEnabled?: boolean) => void
	initialAiEnabled?: boolean
}

export default function ScribblesInput({
	onSendScribble,
	onSendImage,
	onSendAudio,
	initialAiEnabled = false,
}: ScribblesInputProps) {
	const { colors } = useTheme()
	const [text, setText] = useState('')
	const [spaceItems, setSpaceItems] = useState<string[]>([])
	const [aiEnabled, setAiEnabled] = useState(initialAiEnabled)
	const [isRecording, setIsRecording] = useState(false)

	useEffect(() => {
		setAiEnabled(initialAiEnabled)
	}, [initialAiEnabled])

	const handleSend = () => {
		const trimmedText = text.trim()
		if (trimmedText) {
			onSendScribble(trimmedText, spaceItems, aiEnabled)
			setText('')
			setSpaceItems([])
		}
	}

	const removeSpaceItem = (item: string) => {
		setSpaceItems(spaceItems.filter((i) => i !== item))
	}

	const handleSpaceItemSelect = (item: string) => {
		if (!spaceItems.includes(item)) {
			setSpaceItems([...spaceItems, item])
		}
	}

	const renderInputActions = () => (
		<View className="flex-row justify-between items-center">
			<View className="flex-row items-center gap-3">
				<SpaceItemMenu onSelectSpaceItem={handleSpaceItemSelect} />
				{onSendImage && (
					<>
						<ImagePickerButton
							onSendImage={(uri, caption, spaceItems) => onSendImage(uri, caption, aiEnabled)}
							onOpenPicker={() => {}}
							source="library"
						/>
						<ImagePickerButton
							onSendImage={(uri, caption, spaceItems) => onSendImage(uri, caption, aiEnabled)}
							onOpenPicker={() => {}}
							source="camera"
						/>
					</>
				)}

				<TouchableOpacity
					className="rounded-full h-8 flex-row items-center justify-center px-3"
					onPress={() => setAiEnabled(!aiEnabled)}
					style={{
						backgroundColor: aiEnabled ? colors.text.accent : colors.surface.primary,
						borderWidth: aiEnabled ? 0 : 1,
						borderColor: colors.border.light,
					}}
				>
					<Text
						style={{
							color: aiEnabled ? colors.background : colors.text.secondary,
							fontWeight: '500',
							fontSize: 12,
						}}
					>
						AI
					</Text>
				</TouchableOpacity>
			</View>

			<View className="flex-row items-center gap-2">
				{!text.trim() && !isRecording && (
					<TouchableOpacity
						className="rounded-full h-10 w-10 flex items-center justify-center"
						onPress={() => setIsRecording(true)}
					>
						<MicIcon size={24} color={colors.text.secondary} />
					</TouchableOpacity>
				)}

				{text.trim() && (
					<TouchableOpacity className="rounded-full h-10 w-10 flex items-center justify-center" onPress={handleSend}>
						<ArrowRightIcon size={24} color={colors.text.secondary} />
					</TouchableOpacity>
				)}
			</View>
		</View>
	)

	const renderTextInput = () => (
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
					<SpaceItemContainer items={spaceItems} onRemove={removeSpaceItem} />
					<View className="flex-row items-start">
						<TextInput
							className="flex-1 leading-6 py-3 mb-3"
							style={{ color: colors.text.primary }}
							multiline
							numberOfLines={6}
							onChangeText={setText}
							value={text}
							placeholder="Let your ideas flow..."
							placeholderTextColor={colors.text.tertiary}
							textAlignVertical="top"
						/>
					</View>
					{renderInputActions()}
				</LinearGradient>
			</LinearGradient>
		</View>
	)

	return (
		<>
			{isRecording ? (
				<AudioRecorder
					onClose={() => {
						setIsRecording(false)
						setSpaceItems([])
					}}
					onSendAudio={(uri, duration, items) => {
						onSendAudio?.(uri, duration, items, aiEnabled)
						setSpaceItems([])
					}}
					onSelectSpaceItem={handleSpaceItemSelect}
					spaceItems={spaceItems}
					onRemoveSpaceItem={removeSpaceItem}
				/>
			) : (
				renderTextInput()
			)}
		</>
	)
}
