/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		APP_KEY: process.env.APP_KEY,
		NEXT_BASE_URL: process.env.NEXT_BASE_URL,
		NEXT_BASE_API_URL: process.env.NEXT_BASE_API_URL,
		NEXT_TIMEOUT: process.env.NEXT_TIMEOUT,
	},
}

export default nextConfig
