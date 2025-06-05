import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { View, TouchableOpacity } from 'react-native'
import { ChevronLeftIcon, SearchIcon, SunIcon, MoonIcon } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useCallback } from 'react'
import ScribbleFilterTabs from './components/scribble-filter-tabs'

export default function ScribbleScreenLayout() {
	const router = useRouter()
	const { colors, toggleTheme, theme } = useTheme()
	const [isNavigating, setIsNavigating] = useState(false)

	const handleBack = useCallback(() => {
		if (isNavigating) return

		setIsNavigating(true)
		router.back()
		setTimeout(() => setIsNavigating(false), 300)
	}, [isNavigating])

	const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 }

	const headerOptions = {
		headerStyle: {
			backgroundColor: colors.background,
		},
		headerTitleStyle: {
			color: colors.text.secondary,
			fontSize: 15,
			fontWeight: '500' as const,
		},
		headerShadowVisible: false,
		headerLeft: () => (
			<TouchableOpacity
				onPress={handleBack}
				className="rounded-full h-10 w-10 flex items-center justify-center mr-1"
				delayPressIn={0}
				activeOpacity={0.7}
				hitSlop={hitSlop}
			>
				<ChevronLeftIcon size={24} color={colors.text.secondary} />
			</TouchableOpacity>
		),
		headerRight: () => (
			<View className="flex-row items-center gap-2 mr-1">
				{/* <ScribbleFilterTabs /> */}
				<TouchableOpacity
					onPress={toggleTheme}
					className="rounded-full h-10 w-10 flex items-center justify-center"
					delayPressIn={0}
					activeOpacity={0.7}
					hitSlop={hitSlop}
				>
					{theme === 'dark' ? (
						<SunIcon size={22} color={colors.text.secondary} />
					) : (
						<MoonIcon size={22} color={colors.text.secondary} />
					)}
				</TouchableOpacity>
			</View>
		),
	}

	return (
		<SafeAreaProvider>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...headerOptions,
						title: 'Scribbles',
					}}
				/>
				<Stack.Screen
					name="scribble-thread"
					options={{
						...headerOptions,
						title: 'Thread',
					}}
				/>
			</Stack>
		</SafeAreaProvider>
	)
}
