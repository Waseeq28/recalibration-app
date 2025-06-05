import React, { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { useTheme } from '@/contexts/ThemeContext'
import ImageViewerModal from './image-viewer-modal'
import SpaceItemContainer from '../space-items/space-item-container'
import { cn } from '@/lib/utils'
import { Scribble } from '@/lib/db/schemas/scribble.schema'

interface ImageCardProps extends Pick<Scribble, 'content' | 'caption' | 'spaceItems'> {}

export default function ImageCard({ content, caption, spaceItems }: ImageCardProps) {
	const { colors } = useTheme()
	const [aspectRatio, setAspectRatio] = useState(1)
	const [containerWidth, setContainerWidth] = useState(0)
	const [isViewerOpen, setIsViewerOpen] = useState(false)
	const [hasLoaded, setHasLoaded] = useState(false)

	const handleImageLoad = useCallback(
		(e: { source: { width: number; height: number } }) => {
			if (!hasLoaded) {
				const { width: originalWidth, height: originalHeight } = e.source
				const ratio = originalWidth / originalHeight
				setAspectRatio(ratio)
				const renderedHeight = Math.min(originalHeight, 300)
				const renderedWidth = (renderedHeight * originalWidth) / originalHeight
				setContainerWidth(renderedWidth)
				setHasLoaded(true)
			}
		},
		[hasLoaded],
	)

	if (!content) return null

	return (
		<>
			<TouchableOpacity
				className="p-2"
				onPress={() => setIsViewerOpen(true)}
				activeOpacity={0.9}
				style={{ alignSelf: 'flex-start' }}
			>
				<View>
					<Image
						source={content}
						style={{
							width: '100%',
							aspectRatio,
							maxHeight: 300,
							minWidth: 250,
							borderRadius: 8,
						}}
						contentFit="cover"
						onLoad={handleImageLoad}
					/>

					{spaceItems && spaceItems.length > 0 && <SpaceItemContainer items={spaceItems} className="mt-2" />}
					{caption && (
						<Text
							style={{ color: colors.text.secondary, maxWidth: containerWidth, minWidth: 250 }}
							className={cn('text-sm line-clamp-3 mt-2', spaceItems?.length && 'mt-1')}
						>
							{caption}
						</Text>
					)}
				</View>
			</TouchableOpacity>

			<ImageViewerModal
				isVisible={isViewerOpen}
				imageUrl={content}
				caption={caption}
				spaceItems={spaceItems}
				onClose={() => setIsViewerOpen(false)}
			/>
		</>
	)
}
