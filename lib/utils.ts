import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Constants from 'expo-constants'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const generateAPIUrl = (relativePath: string) => {
	const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

	// 1. Use explicit environment variable if it exists (works in dev & prod)
	if (process.env.EXPO_PUBLIC_API_BASE_URL) {
	  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
	}

	// 2. Attempt to derive origin from Expo dev server information
	let origin: string | undefined;

	if (Constants.experienceUrl) {
	  // Typical value: exp://192.168.1.100:8081
	  origin = Constants.experienceUrl.replace('exp://', 'http://');
	}

	// SDK 49+ exposes hostUri inside expoConfig
	if (!origin && (Constants as any)?.expoConfig?.hostUri) {
	  origin = `http://${(Constants as any).expoConfig.hostUri}`;
	}

	// As a last-resort, attempt to use debuggerHost from classic manifest
	if (!origin && (Constants as any)?.manifest?.debuggerHost) {
	  origin = `http://${(Constants as any).manifest.debuggerHost.split(':').shift()}:8081`;
	}

	if (!origin) {
	  throw new Error(
	    'Unable to determine API base URL. Set EXPO_PUBLIC_API_BASE_URL environment variable.',
	  );
	}

	return origin.concat(path);
};
