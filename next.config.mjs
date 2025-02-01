/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // Enables static export
    reactStrictMode: true, // Optional: Ensures React strict mode
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Include environment variables
    },
};

export default nextConfig;
