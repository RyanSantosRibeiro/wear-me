/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
    middlewareClientMaxBodySize: 50 * 1024 * 1024,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://wearme2--cloude.myvtex.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,POST",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Private-Network",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;