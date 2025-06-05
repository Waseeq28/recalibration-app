import { useState, useEffect } from 'react'
import { useRxDb } from '../RxDbProvider'
import { Scribble } from '../schemas/scribble.schema'
import { useScribbleOperations, FilterType } from './useScribbleOperations'

export type ScribbleGroup = {
	date: string
	scribbles: Scribble[]
}

export function useScribbles(parentId?: string) {
	const { db, isLoading: isDbLoading } = useRxDb()
	const { currentFilter, getFilteredScribbles } = useScribbleOperations()
	const [scribbleGroups, setScribbleGroups] = useState<ScribbleGroup[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!db || isDbLoading) return

		const fetchScribbles = async () => {
			setIsLoading(true)
			const scribbleCollection = db.collections.scribbles

			if (!parentId) {
				const allScribbles = await scribbleCollection.find().exec()
				const replyCounts = new Map<string, number>()
				allScribbles.forEach((doc) => {
					const scribble = doc.toJSON()
					if (scribble.parentId) {
						const count = replyCounts.get(scribble.parentId) || 0
						replyCounts.set(scribble.parentId, count + 1)
					}
				})
				for (const doc of allScribbles) {
					const scribble = doc.toJSON()
					const currentCount = scribble.replyCount || 0
					const newCount = replyCounts.get(scribble.id) || 0

					if (currentCount !== newCount) {
						await doc.update({
							$set: { replyCount: newCount },
						})
					}
				}
			}

			let scribbleArray: Scribble[] = []

			if (parentId) {
				const repliesQuery = scribbleCollection.find({
					selector: { parentId },
				})
				const replies = await repliesQuery.exec()
				const parent = await scribbleCollection.findOne(parentId).exec()

				if (parent) {
					scribbleArray = [...replies.map((doc) => doc.toJSON()), parent.toJSON()]
				} else {
					scribbleArray = replies.map((doc) => doc.toJSON())
				}
			} else {
				scribbleArray = await getFilteredScribbles(currentFilter)
			}

			const groupedScribbles: { [key: string]: Scribble[] } = {}
			scribbleArray.forEach((scribble) => {
				if (!groupedScribbles[scribble.date]) {
					groupedScribbles[scribble.date] = []
				}
				groupedScribbles[scribble.date].push(scribble)
			})

			const groups: ScribbleGroup[] = Object.keys(groupedScribbles).map((date) => ({
				date,
				scribbles: groupedScribbles[date].sort((a, b) => {
					return (a.createdAt || 0) - (b.createdAt || 0)
				}),
			}))

			groups.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

			setScribbleGroups(groups)
			setIsLoading(false)
		}

		fetchScribbles()

		if (db.collections.scribbles) {
			const subscription = db.collections.scribbles.find().$.subscribe(() => {
				fetchScribbles()
			})
			return () => {
				subscription.unsubscribe()
			}
		}
	}, [db, isDbLoading, parentId, currentFilter, getFilteredScribbles])

	return {
		scribbleGroups,
		isLoading: isLoading || isDbLoading,
	}
}
