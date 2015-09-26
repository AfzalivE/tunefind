/**
 * Build
 * =====
 *
 *
 */

var path = require('path')
var fs = require('fs')

var webpack = require('webpack')
var merge = require('deep-merge')(function (target, source) {
  if (target instanceof Array) {
    return [].concat(target, source)
  }
  return source
})

var manifest = require('./package.json')

// environment (default mode: development)
var env = {
  ENTRY_FILE: path.resolve(__dirname, 'src/index.js'),
  SOURCE_DIRECTORY: path.resolve(__dirname, 'src'),
  NODE_MODULES_DIRECTORY: path.resolve(__dirname, 'node_modules'),
  DIST_DIRECTORY: path.dirname(manifest.main),
  EXPORT_NAME: path.basename(manifest.main, path.extname(manifest.main)),
  isProduction: (process.env.NODE_ENV === 'production') || process.argv.length > 2
}

var config = {
  target: 'node',
  entry: env.ENTRY_FILE,
  output: {
    path: env.DIST_DIRECTORY,
    library: env.EXPORT_NAME,
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js']
  },
  node: {
    __dirname: true,
    __filename: true
  },
  externals: fs.readdirSync(env.NODE_MODULES_DIRECTORY).reduce(function (modules, mod) {
    if (['.bin'].indexOf(mod) === -1) { // non-binary module
      modules[mod] = 'commonjs ' + mod
    }
    return modules
  }, Object.create(null)),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: env.SOURCE_DIRECTORY,
        loader: 'babel',
        query: {
          optional: ['runtime'],
          stage: 0
        }
      }
    ]
  }
}

// development: build + watch
if (!env.isProduction) {
  return webpack(merge(config, {
    devtool: 'sourcemap', // inline-source-map
    debug: true,
    output: {
      filename: env.EXPORT_NAME + '.js'
    },
    plugins: [
      new webpack.BannerPlugin('require("source-map-support").install();', {
        entryOnly: false,
        raw: true
      })
    ]

  })).watch(100, notify)
}

// production: release
webpack(merge(config, {
  devtool: 'eval',
  output: {
    filename: env.EXPORT_NAME + '.js' // + '.min.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      sourceMap: false
    })
  ]
})).run(notify)


function notify (error, stats) {
  if (error) {
    return console.error(error)
  }
  console.log(new Date().toISOString(), ' - [' + env.EXPORT_NAME + ']', stats.toString())
}
