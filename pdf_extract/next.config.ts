/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';
import type { WebpackConfigContext } from 'next/dist/server/config-shared';

const nextConfig: NextConfig = {
  webpack: (config: any, { isServer }) => {
    // Your existing configuration remains the same
    if (isServer) {
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node',
      });
    }
    
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
    });
    
    return config;
  },
}

module.exports = nextConfig