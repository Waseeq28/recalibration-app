import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { RxDatabase } from 'rxdb'
import { initializeRxDb } from './initialize-rx-db'

const RxDbContext = createContext<{ db: RxDatabase | null; isLoading: boolean }>({
	db: null,
	isLoading: true,
})

interface RxDbProviderProps {
	children: ReactNode
}

export const RxDbProvider: React.FC<RxDbProviderProps> = ({ children }) => {
	const [db, setDb] = useState<RxDatabase | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const initDb = async () => {
			try {
				const database = await initializeRxDb()
				setDb(database)
			} catch (error) {
				console.error('Failed to initialize database:', error)
			} finally {
				setIsLoading(false)
			}
		}

		initDb()

		return () => {
			if (db) {
				db.remove()
			}
		}
	}, [])

	return <RxDbContext.Provider value={{ db, isLoading }}>{children}</RxDbContext.Provider>
}

export const useRxDb = () => {
	const context = useContext(RxDbContext)
	if (context === undefined) {
		throw new Error('useRxDb must be used within a RxDbProvider')
	}
	return context
}
