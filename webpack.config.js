const path = require('path');

module.exports = {
  entry: './lib/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, path.resolve(__dirname, 'example')],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', jsx],
  },
};
