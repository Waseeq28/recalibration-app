const darkColors = {
	background: '#08090A',
	surface: {
		primary: 'rgba(48, 48, 48, 0.95)',
		secondary: 'rgba(38, 38, 38, 0.97)',
		tertiary: 'rgba(32, 32, 32, 0.98)',
		button: '#333333',
		tag: '#404040',
	},
	text: {
		primary: '#FFFFFF',
		secondary: 'rgba(255, 255, 255, 0.6)',
		tertiary: 'rgba(255, 255, 255, 0.4)',
		accent: 'rgba(130, 170, 255, 0.9)',
		destructive: 'rgba(255, 95, 95, 0.9)',
	},
	border: {
		light: 'rgba(255, 255, 255, 0.15)',
		lighter: 'rgba(255, 255, 255, 0.18)',
	},
	gradients: {
		card: {
			outer: ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)'] as [string, string],
			inner: ['rgba(48, 48, 48, 0.95)', 'rgba(38, 38, 38, 0.97)'] as [string, string],
			aiOuter: ['rgba(130, 170, 255, 0.25)', 'rgba(130, 170, 255, 0.15)'] as [string, string],
			aiInner: ['rgba(40, 44, 58, 0.95)', 'rgba(35, 38, 52, 0.97)'] as [string, string],
		},
	},
}

const lightColors = {
	background: '#FFFFFF',
	surface: {
		primary: 'rgba(245, 245, 245, 0.95)',
		secondary: 'rgba(250, 250, 250, 0.97)',
		tertiary: 'rgba(252, 252, 252, 0.98)',
		button: '#F0F0F0',
		tag: '#EEEEEE',
	},
	text: {
		primary: '#000000',
		secondary: 'rgba(0, 0, 0, 0.6)',
		tertiary: 'rgba(0, 0, 0, 0.4)',
		accent: 'rgba(0, 102, 255, 0.9)',
		destructive: 'rgba(255, 59, 48, 0.9)',
	},
	border: {
		light: 'rgba(0,0,0,0.08)',
		lighter: 'rgba(0, 0, 0, 0.05)',
	},
	gradients: {
		card: {
			outer: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)'] as [string, string],
			inner: ['#F5F5F5', '#F5F5F5'] as [string, string],
			aiOuter: ['rgba(0, 102, 255, 0.1)', 'rgba(0, 102, 255, 0.05)'] as [string, string],
			aiInner: ['#EEF3FF', '#F0F5FF'] as [string, string],
		},
	},
}

export const colors = {
	dark: darkColors,
	light: lightColors,
}

export type Theme = 'light' | 'dark'
