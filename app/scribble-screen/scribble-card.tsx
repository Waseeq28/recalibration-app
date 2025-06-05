import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { LinearGradient } from 'expo-linear-gradient'
import AudioCard from './components/audio/audio-card'
import ImageCard from './components/image/image-card'
import TextCard from './components/text/text-card'
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu'
import ScribbleContextMenu from './components/scribble-context-menu'
import ThreadReplyButton from './components/thread-reply-button'
import { Scribble } from '@/lib/db/schemas/scribble.schema'

interface ScribbleCardProps extends Scribble {
	isThreadParent?: boolean
	isThreadReply?: boolean
}

export default function ScribbleCard(props: ScribbleCardProps) {
	const { colors } = useTheme()
	const { type, id, timestamp, isThreadParent, isThreadReply, replyCount, isAiGenerated } = props

	const showReplyButton = id && !(isThreadReply || isThreadParent)

	const renderContent = () => {
		switch (type) {
			case 'text':
				return <TextCard {...props} />
			case 'image':
				return <ImageCard {...props} />
			case 'audio':
				return <AudioCard {...props} />
			default:
				return null
		}
	}

	const containerAlignment = isAiGenerated ? 'flex-start' : 'flex-end'
	const outerGradient = isAiGenerated ? colors.gradients.card.aiOuter : colors.gradients.card.outer
	const innerGradient = isAiGenerated ? colors.gradients.card.aiInner : colors.gradients.card.inner

	return (
		<ContextMenu relativeTo="longPress">
			<ContextMenuTrigger>
				<View className="flex flex-row" style={{ justifyContent: containerAlignment }}>
					<View className="max-w-[95%] rounded-xl overflow-hidden" style={{ backgroundColor: colors.border.light }}>
						<LinearGradient colors={outerGradient} start={{ x: 0.9, y: 0.5 }} end={{ x: 0.1, y: 0.5 }}>
							<LinearGradient
								colors={innerGradient}
								start={{ x: 0.9, y: 0.5 }}
								end={{ x: 0.1, y: 0.5 }}
								className="rounded-xl"
							>
								{renderContent()}

								<View className="px-3 mt-1 mb-3">
									<View className="flex-row justify-between items-center">
										{showReplyButton ? (
											<ThreadReplyButton
												scribbleId={id}
												replyCount={replyCount}
												isThreadReply={isThreadReply}
												isThreadParent={isThreadParent}
											/>
										) : (
											<View />
										)}
										<Text style={{ color: colors.text.tertiary }} className="text-xs ml-4">
											{timestamp}
										</Text>
									</View>
								</View>
							</LinearGradient>
						</LinearGradient>
					</View>
				</View>
			</ContextMenuTrigger>
			<ScribbleContextMenu scribbleId={id} />
		</ContextMenu>
	)
}
