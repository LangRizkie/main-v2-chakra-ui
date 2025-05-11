import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: ['@chakra-ui/react']
	},
	reactStrictMode: false,
	rewrites: async () => [
		{
			destination: `http://localhost:3001/platform_center/:path*`,
			source: '/platform_center/:path*'
		},
		{
			destination: `http://localhost:3001/platform-static/:path*`,
			source: '/platform-static/:path*'
		},
		{
			destination: `http://localhost:3002/ifrs9/:path*`,
			source: '/ifrs9/:path*'
		},
		{
			destination: `http://localhost:3002/ifrs9-static/:path*`,
			source: '/ifrs9-static/:path*'
		}
	]
}

export default nextConfig
