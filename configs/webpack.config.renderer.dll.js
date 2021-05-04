const path = require('path')
const webpack = require('webpack')
const chalk = require('chalk')
const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.config.base')
const { dependencies } = require('../package.json')


const dist = path.join(__dirname, '../dll');



// if (!(fs.existsSync(dllDir) && fs.existsSync(manifest))) {
//   console.log(
//     chalk.black.bgYellow.bold(
//       'The DLL files are missing. Generating DLL files'
//     )
//   );
//   execSync('npm run postinstall');
// }

const dllConfig =  merge(baseConfig, {
  devtool: 'eval',
  mode: 'development',
  target: 'electron-renderer',
  externals: ['fsevents', 'crypto-browserify'],
  entry: {
    renderer: Object.keys(dependencies || {}),
  },
  output: {
    library: 'vendor',
    path: dist,
    filename: 'vendor.dll.js',
    libraryTarget: 'var',
  },
  plugins: [

    new webpack.DllPlugin({
      path: path.join(dist, 'manifest.json'),
      name: 'vendor',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.join(__dirname, '../../src'),
        output: {
          path: path.join(__dirname, '../dll'),
        },
      },
    }),
  ],

  node: {},

});

module.exports = dllConfig
