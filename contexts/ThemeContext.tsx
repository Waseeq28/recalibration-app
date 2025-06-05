import React, { createContext, useContext, useState, useCallback } from 'react'
import { colors } from '@/constants/theme'
import type { Theme } from '@/constants/theme'

type ThemeContextType = {
	theme: Theme
	toggleTheme: () => void
	colors: typeof colors.light | typeof colors.dark
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>('dark')
	const [isToggling, setIsToggling] = useState(false)

	const toggleTheme = useCallback(() => {
		if (isToggling) return

		setIsToggling(true)
		setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
		setTimeout(() => setIsToggling(false), 300)
	}, [isToggling])

	const value = {
		theme,
		toggleTheme,
		colors: colors[theme],
	}

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (!context) throw new Error('useTheme must be used within ThemeProvider')
	return context
}
