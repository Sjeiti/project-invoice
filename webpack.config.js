const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const {InjectManifest} = require('workbox-webpack-plugin')
const {GenerateSW} = require('workbox-webpack-plugin')

module.exports = env => {
  const isProduction = !!env&&env.production
  const mode = isProduction?'production':'development'
  console.log('mode', mode, '\n')
  return {
    mode
    ,entry: './src/index.js'
    ,output: {
      path: path.resolve(__dirname, 'dist')
      ,filename: 'bundle.js'
    }
    ,devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      }
      ,port: 4212
      ,historyApiFallback: true
      ,https: true
    },
    module: {
      exprContextCritical: false
      ,rules: [
        {
          test: /\.(js|jsx)$/
          ,use: 'babel-loader'
          ,exclude: /node_modules/
        }
        ,{
          test: /\.scss$/
          ,use: [
            'style-loader'
            ,'css-loader'
            ,'sass-loader'
          ]
        }
        ,{
          test: /\.(html|css)/
          ,use: ['raw-loader']
        }
        ,{
          test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [{
            loader: 'file-loader',
          }]
        }
        // ,{
        //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
        //   type: 'asset/resource',
        // }
      ]
    }
    ,resolve: {
      extensions: [
        '.js'
        ,'.jsx'
        ,'.json'
        ,'.html'
      ]
      ,fallback: {
        fs: false
      }
    }
    ,plugins: [

      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(require('./package.json').version),
        'process.env.BASE_URL': ''
      })

      ,new CopyWebpackPlugin([
          { from: 'public', to: './', toType: 'dir', dot: true}
          ,{ from: 'node_modules/qr-scanner/qr-scanner-worker.min.js', to: './qr-scanner-worker.min.js' }
      ], {})

      // see https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW
      ,...(isProduction?[new GenerateSW({
        cleanupOutdatedCaches: true
        , maximumFileSizeToCacheInBytes: 4000000
        // , globDirectory: 'dist'
        // , globPatterns: [
        //    '*.html'
        //   , '*.css'
        //   , '*.js'
        //   , '*.png'
        //   , '*.svg'
        //   , '*.xml'
        //   , '*.json'
        // ]
        // , include: ['*.*']
      })]:[])

    ]
  }
}
