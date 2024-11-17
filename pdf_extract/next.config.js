/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude onnxruntime-node from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'onnxruntime-node': false,
      };
    }

    // Handle binary files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
      exclude: /node_modules/,
    });

    return config;
  },
  // Disable strict mode for now to avoid double rendering issues
  reactStrictMode: false,
}

module.exports = nextConfig;
