/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path from 'path';

export default {
  webpack(config) {
    config.module.rules.push({
      test: /\.glb$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: 'static/models/',
            publicPath: '/_next/static/models/',
            name: '[name].[hash].[ext]',
          },
        },
      ],
    });

    return config;
  },
};
