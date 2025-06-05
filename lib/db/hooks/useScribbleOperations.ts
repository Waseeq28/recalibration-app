import { useCallback, useState } from 'react'
import { useRxDb } from '../RxDbProvider'
import { nanoid } from 'nanoid'
import { Scribble, ScribbleType } from '../schemas/scribble.schema'
import { format } from 'date-fns'

const formatTimestamp = (date: Date): string => {
	return format(date, 'h:mm a')
}

const formatDate = (date: Date): string => {
	return format(date, 'MMM d, yyyy')
}

export type FilterType = 'open' | 'archived' | 'all'

export function useScribbleOperations() {
	const { db, isLoading: isDbLoading } = useRxDb()
	const [currentFilter, setCurrentFilter] = useState<FilterType>('open')

	const addScribble = useCallback(
		async (
			type: ScribbleType,
			content?: string,
			options?: {
				caption?: string
				spaceItems?: string[]
				duration?: number
				transcription?: {
					status: 'completed' | 'processing'
					text?: string
				}
				parentId?: string
				isAiEnabled?: boolean
				isAiGenerated?: boolean
			},
		) => {
			if (!db || isDbLoading) return null

			const now = new Date()
			const date = formatDate(now)
			const timestamp = formatTimestamp(now)
			const createdAt = now.getTime()

			const newScribble: Scribble = {
				id: nanoid(),
				type,
				timestamp,
				date,
				content,
				replyCount: 0,
				createdAt,
				archived: false,
				...options,
			}

			await db.collections.scribbles.insert(newScribble)
			if (options?.parentId) {
				const parentScribble = await db.collections.scribbles.findOne(options.parentId).exec()
				if (parentScribble) {
					const currentCount = parentScribble.replyCount || 0
					await parentScribble.update({
						$set: { replyCount: currentCount + 1 },
					})
				}
			}

			return newScribble.id
		},
		[db, isDbLoading],
	)

	const getScribbleById = useCallback(
		async (id: string): Promise<Scribble | null> => {
			if (!db || isDbLoading) return null

			const scribble = await db.collections.scribbles.findOne(id).exec()
			return scribble ? scribble.toJSON() : null
		},
		[db, isDbLoading],
	)

	const deleteScribble = useCallback(
		async (id: string): Promise<boolean> => {
			if (!db || isDbLoading) return false

			const scribble = await db.collections.scribbles.findOne(id).exec()

			if (!scribble) return false

			if (scribble.parentId) {
				const parentScribble = await db.collections.scribbles.findOne(scribble.parentId).exec()
				if (parentScribble) {
					const currentCount = parentScribble.replyCount || 0
					await parentScribble.update({
						$set: { replyCount: Math.max(0, currentCount - 1) },
					})
				}
			}

			await scribble.remove()
			return true
		},
		[db, isDbLoading],
	)

	const toggleArchiveScribble = useCallback(
		async (id: string): Promise<boolean> => {
			if (!db || isDbLoading) return false

			const scribble = await db.collections.scribbles.findOne(id).exec()
			if (!scribble) return false

			const currentArchivedState = scribble.archived || false
			await scribble.update({
				$set: { archived: !currentArchivedState },
			})

			return true
		},
		[db, isDbLoading],
	)

	const getFilteredScribbles = useCallback(
		async (filter: FilterType = currentFilter, parentId?: string): Promise<Scribble[]> => {
			if (!db || isDbLoading) return []

			let query = db.collections.scribbles.find()

			if (parentId) {
				query = query.where('parentId').eq(parentId)
			} else {
				query = query.where('parentId').eq(undefined)
			}

			if (filter === 'open') {
				query = query.where('archived').eq(false)
			} else if (filter === 'archived') {
				query = query.where('archived').eq(true)
			}

			query = query.sort({ createdAt: 'asc' })

			const results = await query.exec()
			return results.map((doc) => doc.toJSON())
		},
		[db, isDbLoading, currentFilter],
	)

	const setFilter = useCallback((filter: FilterType) => {
		setCurrentFilter(filter)
	}, [])

	return {
		isLoading: isDbLoading,
		currentFilter,
		setFilter,
		addScribble,
		getScribbleById,
		deleteScribble,
		toggleArchiveScribble,
		getFilteredScribbles,
	}
}
