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

    if (isServer) {
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node',
      });
    }
    
    // Handle binary files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
      exclude: /node_modules/,
    });

    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
    });
    
    return config;
  },
}

module.exports = nextConfig;
