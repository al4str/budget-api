require('dotenv').config();

const path = require('path');
const childProcess = require('child_process');
const consola = require('consola');
const nodemon = require('nodemon');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const serverScriptPath = path.join(process.cwd(), 'dist', 'index.js');
const nodemonConfig = {
  verbose: false,
  signal: 'SIGHUP',
  ignore: [
    'db',
    'dist',
    'node_modules',
    'src',
    'storage',
    'temp',
  ],
  watch: [
    '.env',
    'package.json',
    'webpack.config.js',
  ],
  exec: 'echo "" > /dev/null',
};
const watchOptions = {
  ignored: /node_modules/,
};
const console = consola.withTag('dev');
const nodemonWatcher = nodemon(nodemonConfig);
const compiler = webpack(webpackConfig);
let watchInstance = null;
/** @type {ChildProcess} */
let serverInstance = null;

nodemonWatcher.on('start', handleStart);
nodemonWatcher.on('restart', handleRestart);
nodemonWatcher.on('crash', handleCrash);
nodemonWatcher.on('quit', handleQuit);

/**
 * @param {Error} err
 * @param {MultiStats} stats
 * */
function watchHandler(err, stats) {
  if (serverInstance) {
    serverInstance.kill('SIGKILL');
  }
  if (err) {
    console.error(err);
    return;
  }
  console.info(stats.toString('minimal'));
  serverInstance = childProcess.execFile('node', [serverScriptPath]);
  serverInstance.on('error', (err) => {
    console.error(err);
  });
  serverInstance.stdout.on('data', (message) => {
    console.log(message);
  });
  serverInstance.stderr.on('data', (message) => {
    console.error(message);
  });
}

function handleStart() {
  console.info('start');
  if (!watchInstance) {
    watchInstance = compiler.watch(watchOptions, watchHandler);
  }
}

function handleRestart() {
  console.info('restart');
  if (watchInstance) {
    watchInstance.invalidate();
  }
}

function handleCrash() {
  console.info('crash');
}

function handleQuit() {
  console.info('quit');
  if (serverInstance) {
    serverInstance.kill('SIGKILL');
  }
  if (watchInstance) {
    watchInstance.close(() => {
      process.exit(0);
    });
  }
}
