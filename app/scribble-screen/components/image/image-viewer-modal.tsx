import React, { useState } from 'react'
import { View, TouchableOpacity, Modal, Text } from 'react-native'
import { Image } from 'expo-image'
import { ArrowLeftIcon } from 'lucide-react-native'
import { colors } from '@/constants/theme'
import SpaceItemContainer from '../space-items/space-item-container'
import { cn } from '@/lib/utils'

type ImageViewerModalProps = {
	isVisible: boolean
	imageUrl: string
	caption?: string
	spaceItems?: string[]
	onClose: () => void
}

export default function ImageViewerModal({ isVisible, imageUrl, caption, spaceItems, onClose }: ImageViewerModalProps) {
	const darkColors = colors.dark
	const [isOverlayVisible, setIsOverlayVisible] = useState(true)

	return (
		<Modal visible={isVisible} transparent animationType="fade">
			<View style={{ flex: 1, backgroundColor: darkColors.background }}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setIsOverlayVisible(!isOverlayVisible)}
					className="absolute inset-0"
				>
					<Image
						source={{ uri: imageUrl }}
						style={{ width: '100%', height: '100%', position: 'absolute' }}
						transition={300}
						contentFit="contain"
					/>
				</TouchableOpacity>

				{isOverlayVisible && (
					<>
						<View
							className="absolute top-0 left-0 right-0 p-7 flex items-start"
							style={{ backgroundColor: `${darkColors.background}99` }}
						>
							<TouchableOpacity onPress={onClose}>
								<ArrowLeftIcon size={24} color={darkColors.text.secondary} />
							</TouchableOpacity>
						</View>

						{(caption || spaceItems?.length) && (
							<View
								className={cn(
									'absolute bottom-0 left-0 right-0 py-7 px-4',
									spaceItems?.length ? 'flex items-start' : 'flex items-center',
								)}
								style={{ backgroundColor: `${darkColors.background}99` }}
							>
								{spaceItems && spaceItems.length > 0 && <SpaceItemContainer items={spaceItems} />}
								{caption && (
									<Text style={{ color: darkColors.text.primary }} className="text-lg  py-2">
										{caption}
									</Text>
								)}
							</View>
						)}
					</>
				)}
			</View>
		</Modal>
	)
}
