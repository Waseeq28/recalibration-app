import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'
import { ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu'
import { TrashIcon, ArchiveIcon, ArchiveRestoreIcon } from 'lucide-react-native'
import { Scribble } from '@/lib/db/schemas/scribble.schema'
import { useScribbleOperations } from '@/lib/db/hooks/useScribbleOperations'

interface ScribbleContextMenuProps {
	scribbleId?: Scribble['id']
	onActionComplete?: () => void
}

export default function ScribbleContextMenu({ scribbleId, onActionComplete }: ScribbleContextMenuProps) {
	const { colors } = useTheme()
	const { deleteScribble, toggleArchiveScribble, getScribbleById, currentFilter } = useScribbleOperations()
	const [isArchived, setIsArchived] = useState<boolean>(false)

	useEffect(() => {
		const fetchScribbleStatus = async () => {
			if (!scribbleId) return
			const scribble = await getScribbleById(scribbleId)
			if (scribble) {
				setIsArchived(scribble.archived || false)
			}
		}

		fetchScribbleStatus()
	}, [scribbleId, getScribbleById])

	const handleDelete = async () => {
		if (!scribbleId) return
		await deleteScribble(scribbleId)
		if (onActionComplete) {
			onActionComplete()
		}
	}

	const handleArchiveToggle = async () => {
		if (!scribbleId) return

		const success = await toggleArchiveScribble(scribbleId)

		if (success) {
			const newArchivedState = !isArchived
			setIsArchived(newArchivedState)

			if (onActionComplete) {
				const willDisappearAfterToggle =
					(currentFilter === 'open' && newArchivedState) || (currentFilter === 'archived' && !newArchivedState)

				onActionComplete()

				if (willDisappearAfterToggle) {
					setTimeout(() => {}, 50)
				}
			}
		}
	}

	return (
		<ContextMenuContent
			style={{
				backgroundColor: colors.surface.primary,
				borderColor: colors.border.light,
				padding: 8,
			}}
			align="end"
			avoidCollisions={true}
		>
			<ContextMenuItem className="active:bg-transparent my-0.5" onPress={handleArchiveToggle}>
				<View className="flex-row items-center gap-3">
					{isArchived ? (
						<ArchiveRestoreIcon size={18} color={colors.text.primary} />
					) : (
						<ArchiveIcon size={18} color={colors.text.primary} />
					)}
					<Text style={{ color: colors.text.primary }} className="text-base font-medium">
						{isArchived ? 'Unarchive' : 'Archive'}
					</Text>
				</View>
			</ContextMenuItem>

			<ContextMenuItem className="active:bg-transparent my-0.5" onPress={handleDelete}>
				<View className="flex-row items-center gap-3">
					<TrashIcon size={18} color={colors.text.destructive} />
					<Text style={{ color: colors.text.destructive }} className="text-base font-medium">
						Delete
					</Text>
				</View>
			</ContextMenuItem>
		</ContextMenuContent>
	)
}
