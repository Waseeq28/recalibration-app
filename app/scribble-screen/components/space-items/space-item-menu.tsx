import React from 'react'
import { TouchableOpacity, Text, View, ScrollView } from 'react-native'
import { AtSignIcon, FileTextIcon } from 'lucide-react-native'
import { useTheme } from '@/contexts/ThemeContext'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import { colors as themeConstants } from '@/constants/theme'

type SpaceItemMenuProps = {
	onSelectSpaceItem: (item: string) => void
	darkMode?: boolean
}

const SPACE_ITEMS = [
	{
		id: 1,
		name: 'Work Tasks',
		icon: FileTextIcon,
	},
	{
		id: 2,
		name: 'Random thoughts',
		icon: FileTextIcon,
	},
	{ id: 3, name: 'Project Ideas', icon: FileTextIcon },
	{ id: 4, name: 'Design', icon: FileTextIcon },
	{ id: 5, name: 'Research', icon: FileTextIcon },
	{ id: 6, name: 'Assignments', icon: FileTextIcon },
	{ id: 7, name: 'Biology Notes', icon: FileTextIcon },
	{ id: 8, name: 'Physics Notes', icon: FileTextIcon },
	{ id: 9, name: 'Chemistry Notes', icon: FileTextIcon },
	{ id: 10, name: 'Math Notes', icon: FileTextIcon },
] as const

const PopoverContent = ({
	onSelectSpaceItem,
	onClose,
	darkMode,
}: {
	onSelectSpaceItem: (item: string) => void
	onClose: () => void
	darkMode?: boolean
}) => {
	const { colors } = useTheme()
	const activeColors = darkMode ? themeConstants.dark : colors

	const handleSelect = (item: string) => {
		onSelectSpaceItem(item)
		onClose()
	}

	return (
		<View className="py-2" style={{ maxHeight: 300 }}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{SPACE_ITEMS.map((item) => (
					<TouchableOpacity
						key={item.id}
						onPress={() => handleSelect(item.name)}
						className="flex-row items-center my-2 ml-3 mr-5"
					>
						<item.icon size={18} color={activeColors.text.secondary} />
						<Text
							className="font-medium ml-2 line-clamp-1"
							style={{
								color: activeColors.text.primary,
							}}
						>
							{item.name}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	)
}

export default function SpaceItemMenu({ onSelectSpaceItem, darkMode }: SpaceItemMenuProps) {
	const { colors } = useTheme()
	const [isVisible, setIsVisible] = React.useState(false)
	const activeColors = darkMode ? themeConstants.dark : colors

	return (
		<Popover
			isVisible={isVisible}
			onRequestClose={() => setIsVisible(false)}
			placement={PopoverPlacement.TOP}
			popoverStyle={{
				backgroundColor: activeColors.surface.primary,
				borderWidth: 1,
				borderColor: activeColors.border.light,
				borderRadius: 8,
				maxWidth: 300,
			}}
			from={
				<TouchableOpacity
					onPress={() => setIsVisible(true)}
					className="rounded-full h-10 w-10 flex items-center justify-center"
				>
					<AtSignIcon size={20} color={activeColors.text.secondary} opacity={0.8} />
				</TouchableOpacity>
			}
		>
			<PopoverContent onSelectSpaceItem={onSelectSpaceItem} onClose={() => setIsVisible(false)} darkMode={darkMode} />
		</Popover>
	)
}
