import { RxJsonSchema } from 'rxdb'

export type ScribbleType = 'text' | 'image' | 'audio'

export type Scribble = {
	id: string
	type: ScribbleType
	content?: string
	caption?: string
	spaceItems?: string[]
	timestamp: string
	date: string
	transcription?: {
		status: 'completed' | 'processing'
		text?: string
	}
	duration?: number
	parentId?: string
	replyCount?: number
	createdAt: number
	archived?: boolean
	isAiEnabled?: boolean
	isAiGenerated?: boolean
}

export const scribbleSchema: RxJsonSchema<Scribble> = {
	title: 'scribbles',
	version: 0,
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		type: { type: 'string', enum: ['text', 'image', 'audio'] },
		content: { type: 'string', maxLength: 5000 },
		caption: { type: 'string', maxLength: 500 },
		spaceItems: {
			type: 'array',
			items: {
				type: 'string',
			},
		},
		timestamp: { type: 'string' },
		transcription: {
			type: 'object',
			properties: {
				status: { type: 'string', enum: ['completed', 'processing'] },
				text: { type: 'string' },
			},
			required: ['status'],
		},
		duration: { type: 'number' },
		date: { type: 'string' },
		parentId: { type: 'string', maxLength: 100 },
		replyCount: { type: 'number' },
		createdAt: { type: 'number' },
		archived: { type: 'boolean', default: false },
		isAiEnabled: { type: 'boolean', default: false },
		isAiGenerated: { type: 'boolean', default: false },
	},
	required: ['id', 'type', 'timestamp', 'date', 'createdAt'],
	primaryKey: 'id',
}
