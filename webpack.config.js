const path = require('path');

module.exports = {
  mode: 'production',
  entry: './lib/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.esm.js',
    library: {
      type: 'module'
    },
    globalObject: 'this',
    environment: {
      module: true
    }
  },
  experiments: {
    outputModule: true
  },
  optimization: {
    minimize: false // Disable minification to preserve proper ES module exports
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              module: 'ESNext',
              target: 'ES2020'
            }
          }
        },
        exclude: [/node_modules/, path.resolve(__dirname, 'example')],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx'],
  },
  externals: {
    'react': 'react'
  }
};
