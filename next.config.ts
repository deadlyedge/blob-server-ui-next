import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// output: "standalone",
	experimental: {
		serverActions: {
			bodySizeLimit: "20mb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "f.zick.xyz",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "8020",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "8000",
			},
		],
	},
}

export default nextConfig
