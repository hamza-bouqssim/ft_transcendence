/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
				{
					protocol: 'https',
					hostname: "cdn.intra.42.fr",
				},
				{
					protocol: 'https',
					hostname: "lh3.googleusercontent.com",
				},
				{
					protocol: 'https',
					hostname: "cdn.landesa.org",
				},
				{
					protocol: 'https',
					hostname: "images.squarespace-cdn.com",
				},
				{
					protocol: 'https',
					hostname: "res.cloudinary.com"
				}
        ],
    },
};




module.exports = nextConfig