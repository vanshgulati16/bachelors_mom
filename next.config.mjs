/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['api.dicebear.com'],
    },
    env: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
};

export default nextConfig;
