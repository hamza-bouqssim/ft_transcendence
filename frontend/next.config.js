/** @type {import('next').NextConfig} */

const nextConfig = {};

module.exports = {
	images: {
		domains: [
			"cdn.intra.42.fr",
			"lh3.googleusercontent.com",
			"cdn.landesa.org",
		],
	},
	// experimental: {
	// 	swcPlugins: [["@swc-jotai/react-refresh", {}]],
	// },
};
