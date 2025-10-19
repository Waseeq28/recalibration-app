import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from "expo-constants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const generateAPIUrl = (relativePath: string) => {
	const path = relativePath.startsWith("/")
		? relativePath
		: `/${relativePath}`;

	if (process.env.NODE_ENV === "development") {
		if ((Constants as any)?.expoConfig?.hostUri) {
			const origin = `http://${(Constants as any).expoConfig.hostUri}`;
			return origin.concat(path);
		}

		if (process.env.EXPO_PUBLIC_API_BASE_URL) {
			return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
		}

		throw new Error(
			"Unable to determine development server URL. Please set EXPO_PUBLIC_API_BASE_URL in your .env.local file.",
		);
	}

	if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
		throw new Error(
			"EXPO_PUBLIC_API_BASE_URL environment variable is not defined",
		);
	}

	return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};
