/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: [
			"cdn.intra.42.fr",
			"lh3.googleusercontent.com",
			"cdn.landesa.org",
			"images.squarespace-cdn.com",
			"res.cloudinary.com",
		],
	},
};

module.exports = nextConfig;
