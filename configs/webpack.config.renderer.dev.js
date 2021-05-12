const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const chalk = require('chalk')
const { merge } = require('webpack-merge')
const { spawn, execSync } = require('child_process')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const baseConfig = require('./webpack.config.base')

const port = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`;
const dllDir = path.join(__dirname, '../dll');
const manifest = path.resolve(dllDir, 'manifest.json');

const requiredByDLLConfig = module.parent.filename.includes(
  'webpack.config.renderer.dev.dll'
);

if (!requiredByDLLConfig && !(fs.existsSync(dllDir) && fs.existsSync(manifest))) {
  console.log(
    chalk.black.bgYellow.bold(
      'The DLL files are missing. Generating DLL files'
    )
  );
  execSync('npm run postinstall');
}

let mainProcess = null

process.on("SIGINT", () => {
	if (mainProcess && !mainProcess.killed) {
		mainProcess.kill()
	}
	process.exit(0)
})

const devConfig = merge(baseConfig, {
	externals: [...Object.keys(dependencies || {})],
  devtool: 'inline-source-map',
  mode: 'development',
  target: 'electron-renderer',
  entry: {
    pos: './src/pos/index.tsx',
    loader: './src/loader/index.tsx'
  },
  output: {
    publicPath: `http://localhost:${port}/dist/`,
    filename: '[name].js',
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, '../dll'),
      manifest: require(manifest),
      sourceType: 'var',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new ReactRefreshWebpackPlugin({
      exclude: [
        path.join(__dirname, '../"node_modules"'),
        path.join(__dirname, '../"configs"'),
        path.join(__dirname, '../"dll"'),
        path.join(__dirname, '../"dist"'),
      ],
      include: /\.tsx?$/i
    }),
  ],

  node: {

  },

  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: false,
    stats: 'normal',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    before(app, server) {
      console.log('Starting Main Process...', Boolean(process.env.START_MAIN));
			if (process.env.START_MAIN) {
				mainProcess = spawn('electron', ['.'], {
          env: process.env,
          stdio: 'inherit',
					stderr: "inherit"
        })
				.on('close', (code) => () => {
					console.log("close")
				})
				.on('error', (spawnError) => {
					console.log("ERROR", spawnError)
					// app.close()
					// app.exit(1)
					mainProcess = null
				})
				.on('message', (message) =>  {
					console.log(message)
				})
			}
    },
  },
});

module.exports = devConfig
