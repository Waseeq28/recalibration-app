// import React, { useState } from 'react'
// import { ScrollView, StyleSheet, Text, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { ListItem } from '@rneui/themed'
// import { Ionicons } from '@expo/vector-icons'

// type Space = {
// 	id: number
// 	name: string
// }

// const spaces: Space[] = [
// 	{ id: 1, name: 'Mathematics Notes' },
// 	{ id: 2, name: 'Physics Lecture Notes' },
// 	{ id: 3, name: 'Chemistry Lab Reports' },
// 	{ id: 4, name: 'Code Snippets' },
// ]

// export function SpaceListing() {
// 	const [expandedIds, setExpandedIds] = useState<number[]>([])
// 	const [nestedExpanded, setNestedExpanded] = useState(false)
// 	const [subNestedExpandedIds, setSubNestedExpandedIds] = useState<number[]>([])

// 	const toggleAccordion = (id: number) => {
// 		if (expandedIds.includes(id)) {
// 			setExpandedIds(expandedIds.filter((expandedId) => expandedId !== id))
// 		} else {
// 			setExpandedIds([...expandedIds, id])
// 		}
// 	}

// 	const toggleSubNestedAccordion = (id: number) => {
// 		if (subNestedExpandedIds.includes(id)) {
// 			setSubNestedExpandedIds(subNestedExpandedIds.filter((expandedId) => expandedId !== id))
// 		} else {
// 			setSubNestedExpandedIds([...subNestedExpandedIds, id])
// 		}
// 	}

// 	return (
// 		<SafeAreaView style={styles.container}>
// 			<View style={styles.workspaceSettings}>
// 				<Text style={styles.heading}>Personal Workspace</Text>
// 				<View style={styles.iconsContainer}>
// 					<Ionicons name="ellipsis-horizontal" size={20} />
// 					<Ionicons name="add" size={20} />
// 				</View>
// 			</View>
// 			<ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
// 				<ListItem.Accordion
// 					noIcon
// 					topDivider
// 					containerStyle={styles.accordionContainer}
// 					isExpanded={nestedExpanded}
// 					onPress={() => setNestedExpanded(!nestedExpanded)}
// 					content={
// 						<ListItem.Content style={styles.accordionContent}>
// 							<View style={styles.leftSection}>
// 								{nestedExpanded ? (
// 									<Ionicons name="chevron-down" size={24} />
// 								) : (
// 									<Ionicons name="chevron-forward" size={24} />
// 								)}
// 								<Text style={styles.spaceTitle}>Item with nesting</Text>
// 							</View>
// 							<View style={styles.iconsContainer}>
// 								<Ionicons name="ellipsis-horizontal" size={20} />
// 								<Ionicons name="add" size={20} />
// 							</View>
// 						</ListItem.Content>
// 					}
// 				>
// 					{[1, 2].map((nestedId) => (
// 						<ListItem.Accordion
// 							key={nestedId}
// 							noIcon
// 							containerStyle={[styles.accordionContainer, styles.nestedAccordion]}
// 							isExpanded={subNestedExpandedIds.includes(nestedId)}
// 							onPress={() => toggleSubNestedAccordion(nestedId)}
// 							content={
// 								<ListItem.Content style={styles.accordionContent}>
// 									<View style={styles.leftSection}>
// 										{subNestedExpandedIds.includes(nestedId) ? (
// 											<Ionicons name="chevron-down" size={24} />
// 										) : (
// 											<Ionicons name="chevron-forward" size={24} />
// 										)}
// 										<Text style={styles.spaceTitle}>Nested Item {nestedId}</Text>
// 									</View>
// 									<View style={styles.iconsContainer}>
// 										<Ionicons name="ellipsis-horizontal" size={20} />
// 										<Ionicons name="add" size={20} />
// 									</View>
// 								</ListItem.Content>
// 							}
// 						>
// 							<ListItem.Content style={[styles.accordionContent, styles.subNestedAccordion]}>
// 								<View style={styles.leftSection}>
// 									<Ionicons name="document-text-outline" size={20} color="blue" />
// 									<Text style={styles.spaceTitle}>Document</Text>
// 								</View>
// 								<View style={styles.iconsContainer}>
// 									<Ionicons name="ellipsis-horizontal" size={20} />
// 									<Ionicons name="add" size={20} />
// 								</View>
// 							</ListItem.Content>

// 							<ListItem.Content style={[styles.accordionContent, styles.subNestedAccordion]}>
// 								<View style={styles.leftSection}>
// 									<Ionicons name="chatbox-outline" size={20} color="red" />
// 									<Text style={styles.spaceTitle}>Folder</Text>
// 								</View>
// 								<View style={styles.iconsContainer}>
// 									<Ionicons name="ellipsis-horizontal" size={20} />
// 									<Ionicons name="add" size={20} />
// 								</View>
// 							</ListItem.Content>
// 							<ListItem.Content style={[styles.accordionContent, styles.subNestedAccordion]}>
// 								<View style={styles.leftSection}>
// 									<Ionicons name="folder-outline" size={20} color="green" />
// 									<Text style={styles.spaceTitle}>AI Conversation</Text>
// 								</View>
// 								<View style={styles.iconsContainer}>
// 									<Ionicons name="ellipsis-horizontal" size={20} />
// 									<Ionicons name="add" size={20} />
// 								</View>
// 							</ListItem.Content>
// 						</ListItem.Accordion>
// 					))}
// 				</ListItem.Accordion>
// 				{spaces.map((space) => (
// 					<ListItem.Accordion
// 						key={space.id}
// 						noIcon
// 						topDivider
// 						containerStyle={styles.accordionContainer}
// 						isExpanded={expandedIds.includes(space.id)}
// 						onPress={() => toggleAccordion(space.id)}
// 						content={
// 							<ListItem.Content style={styles.accordionContent}>
// 								<View style={styles.leftSection}>
// 									{expandedIds.includes(space.id) ? (
// 										<Ionicons name="chevron-down" size={24} />
// 									) : (
// 										<Ionicons name="chevron-forward" size={24} />
// 									)}
// 									<Text style={styles.spaceTitle}>{space.name}</Text>
// 								</View>
// 								<View style={styles.iconsContainer}>
// 									<Ionicons name="ellipsis-horizontal" size={20} />
// 									<Ionicons name="add" size={20} />
// 								</View>
// 							</ListItem.Content>
// 						}
// 					>
// 						<View style={styles.expandedContent}>
// 							<Text style={styles.noPagesText}>No pages inside</Text>
// 						</View>
// 					</ListItem.Accordion>
// 				))}
// 			</ScrollView>
// 		</SafeAreaView>
// 	)
// }

// const styles = StyleSheet.create({
// 	container: {
// 		padding: 5,
// 		backgroundColor: '#F0F0F0',
// 	},
// 	workspaceSettings: {
// 		flexDirection: 'row',
// 		justifyContent: 'space-between',
// 		alignItems: 'center',
// 		paddingLeft: 5,
// 		paddingRight: 16,
// 		paddingVertical: 10,
// 	},
// 	heading: {
// 		fontSize: 16,
// 		fontWeight: 'bold',
// 		color: '#888',
// 		marginBottom: 10,
// 	},
// 	scrollContainer: {
// 		marginTop: 10,
// 		backgroundColor: 'white',
// 		borderRadius: 10,
// 	},
// 	scrollContent: {
// 		// paddingBottom: 45,
// 	},
// 	accordionContainer: {
// 		paddingRight: 0,
// 		borderRadius: 10,
// 	},
// 	accordionContent: {
// 		flexDirection: 'row',
// 		justifyContent: 'space-between',
// 		alignItems: 'center',
// 	},
// 	leftSection: {
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		gap: 10,
// 	},
// 	spaceTitle: {
// 		fontSize: 16,
// 	},
// 	iconsContainer: {
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		gap: 10,
// 	},
// 	expandedContent: {
// 		paddingBottom: 15,
// 		paddingHorizontal: 60,
// 		backgroundColor: 'white',
// 	},
// 	nestedAccordion: {
// 		paddingLeft: 30,
// 	},
// 	subNestedAccordion: {
// 		paddingLeft: 70,
// 		paddingRight: 15,
// 		paddingVertical: 10,
// 	},
// 	noPagesText: {
// 		fontSize: 15,
// 		color: '#aaa',
// 	},
// })
