const package = require('../package.json')
const processName = package.pm2.process[1].name

module.exports = {
  apps : [{
    script: 'index.js',
    name: processName,
    wait_ready: true,
    args: [ 'serve', '--config',  "./configs/webpack.config.renderer.dev.js"],
    script: "./node_modules/webpack/bin/webpack.js",
    watch: false,
    env: {
      "NODE_ENV": "development",
    },
  }, ],
};
