const path = require('path');
const { dependencies } = require('../package.json')

const baseConfig =  {
  externals: [...Object.keys(dependencies || {})],
  module: {
    rules: [
      {
        test: /\.(less)$/,
        exclude: /\.module\.(less)$/,
        use: [{
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            }
          }
        }],
        sideEffects: true,
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // OTF Font
      {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'font/otf',
          },
        },
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css', '.less'],
    modules: [path.join(__dirname, '../../src'), 'node_modules'],
  },

  plugins: [],
};


module.exports = baseConfig
