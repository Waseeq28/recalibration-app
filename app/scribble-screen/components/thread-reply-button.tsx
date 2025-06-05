import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'expo-router'

interface ThreadReplyButtonProps {
	scribbleId: string
	replyCount?: number
	isThreadReply?: boolean
	isThreadParent?: boolean
}

export default function ThreadReplyButton({
	scribbleId,
	replyCount = 0,
	isThreadReply,
	isThreadParent,
}: ThreadReplyButtonProps) {
	const { colors } = useTheme()
	const router = useRouter()

	if (isThreadReply || isThreadParent) {
		return null
	}

	const handlePress = () => {
		router.push({
			pathname: '/scribble-screen/scribble-thread' as any,
			params: { scribbleId },
		})
	}

	const textColor = replyCount > 0 ? colors.text.accent : colors.text.tertiary

	return (
		<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
			<Text style={{ color: textColor }} className="text-xs">
				{replyCount === 0 ? 'Reply' : `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
			</Text>
		</TouchableOpacity>
	)
}
