import React, { useState } from 'react'
import { Modal, View, TouchableOpacity, TextInput, Platform, Keyboard, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'
import { useTheme } from '@/contexts/ThemeContext'
import { colors } from '@/constants/theme'
import { ImageIcon, CameraIcon, PencilIcon, XIcon, ArrowRightIcon } from 'lucide-react-native'
import SpaceItemMenu from '../space-items/space-item-menu'
import { LinearGradient } from 'expo-linear-gradient'
import SpaceItemContainer from '../space-items/space-item-container'

type ImagePickerModalProps = {
	onSendImage: (uri: string, caption?: string, spaceItems?: string[]) => void
	onOpenPicker: () => void
	source: 'camera' | 'library'
}

const PICKER_ICONS = {
	library: ImageIcon,
	camera: CameraIcon,
} as const

export default function ImagePickerButton({ onSendImage, onOpenPicker, source }: ImagePickerModalProps) {
	const { colors: themeColors } = useTheme()
	const darkColors = colors.dark
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedImageUri, setSelectedImageUri] = useState('')
	const [imageCaption, setImageCaption] = useState('')
	const [spaceItems, setSpaceItems] = useState<string[]>([])

	const requestPermissions = async (permissionType: 'camera' | 'library') => {
		if (Platform.OS === 'web') return true

		const { status } =
			permissionType === 'camera'
				? await ImagePicker.requestCameraPermissionsAsync()
				: await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (status !== 'granted') {
			Alert.alert('Permission needed', `We need ${permissionType} permissions to make this work!`)
			return false
		}
		return true
	}

	const handleImageSelection = async (source: 'camera' | 'library') => {
		const hasPermission = await requestPermissions(source)
		if (!hasPermission) return

		const result =
			source === 'camera' ? await ImagePicker.launchCameraAsync() : await ImagePicker.launchImageLibraryAsync()

		if (!result.canceled && result.assets?.[0]) {
			setSelectedImageUri(result.assets[0].uri)
			setImageCaption('')
			setModalVisible(true)
		}
	}

	const handleAttachmentPress = async () => {
		onOpenPicker()
		handleImageSelection(source)
	}

	const handleSendImage = () => {
		if (selectedImageUri) {
			onSendImage(selectedImageUri, imageCaption.trim() || undefined, spaceItems)
			setModalVisible(false)
			setSelectedImageUri('')
			setImageCaption('')
			setSpaceItems([])
		}
	}

	const handleSpaceItemSelect = (item: string) => {
		if (!spaceItems.includes(item)) {
			setSpaceItems([...spaceItems, item])
		}
	}

	const handleRemoveSpaceItem = (item: string) => {
		setSpaceItems(spaceItems.filter((i) => i !== item))
	}

	const PickerIcon = PICKER_ICONS[source]

	return (
		<>
			<TouchableOpacity
				className="rounded-full h-10 w-10 flex items-center justify-center"
				onPress={handleAttachmentPress}
			>
				<PickerIcon size={20} color={themeColors.text.secondary} opacity={0.8} />
			</TouchableOpacity>

			<Modal visible={modalVisible} transparent animationType="fade">
				<View style={{ flex: 1, backgroundColor: darkColors.background }} onTouchStart={Keyboard.dismiss}>
					{selectedImageUri && (
						<Image
							source={selectedImageUri}
							style={{ width: '100%', height: '100%', position: 'absolute' }}
							contentFit="contain"
						/>
					)}
					<View className="absolute top-0 left-0 right-0 p-7 flex-row justify-between items-center">
						<TouchableOpacity
							onPress={() => setModalVisible(false)}
							className="p-3 rounded-full"
							style={{ backgroundColor: darkColors.surface.primary }}
						>
							<XIcon size={24} color={darkColors.text.primary} />
						</TouchableOpacity>
						<TouchableOpacity className="p-3 rounded-full" style={{ backgroundColor: darkColors.surface.primary }}>
							<PencilIcon size={24} color={darkColors.text.primary} />
						</TouchableOpacity>
					</View>
					<View className="absolute bottom-2 left-0 right-0 flex items-center">
						<View className="w-full rounded-xl" style={{ backgroundColor: darkColors.border.light }}>
							<LinearGradient
								colors={darkColors.gradients.card.outer}
								start={{ x: 0.9, y: 0.5 }}
								end={{ x: 0.1, y: 0.5 }}
								className="rounded-xl overflow-hidden"
							>
								<LinearGradient
									colors={darkColors.gradients.card.inner}
									start={{ x: 0.9, y: 0.5 }}
									end={{ x: 0.1, y: 0.5 }}
									className="px-4 py-2 rounded-xl"
								>
									<SpaceItemContainer items={spaceItems} onRemove={handleRemoveSpaceItem} darkMode className="mt-2" />
									<View className="flex-row items-center justify-between gap-2">
										<TextInput
											className="flex-1"
											style={{ color: darkColors.text.primary }}
											value={imageCaption}
											onChangeText={setImageCaption}
											placeholder="Add a caption..."
											placeholderTextColor={darkColors.text.tertiary}
										/>
										<SpaceItemMenu onSelectSpaceItem={handleSpaceItemSelect} darkMode />
										<TouchableOpacity
											className="rounded-full h-10 w-10 flex items-center justify-center"
											onPress={handleSendImage}
										>
											<ArrowRightIcon size={24} color={darkColors.text.secondary} />
										</TouchableOpacity>
									</View>
								</LinearGradient>
							</LinearGradient>
						</View>
					</View>
				</View>
			</Modal>
		</>
	)
}
