const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
      contentBase: './public'
      ,port: 4212
      ,historyApiFallback: true
      ,https: true
    },
    module: {
      rules: [
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
      ]
    }
    ,resolve: {
      extensions: [
        '.js'
        ,'.jsx'
        ,'.json'
        ,'.html'
      ]
    }
    ,plugins: [
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(require('./package.json').version)
      })
      ,new CopyWebpackPlugin([
          { from: 'public', to: './', toType: 'dir', dot: true}
          ,{ from: 'node_modules/qr-scanner/qr-scanner-worker.min.js', to: './qr-scanner-worker.min.js' }
      ], {})
      // ,new CopyWebpackPlugin(isProduction&&[
      //     { from: 'public', to: './', toType: 'dir', dot: true}
      //     ,{ from: 'node_modules/qr-scanner/qr-scanner-worker.min.js', to: './qr-scanner-worker.min.js' }
      // ]||[
      //     { from: 'node_modules/qr-scanner/qr-scanner-worker.min.js', to: './qr-scanner-worker.min.js' }
      // ], {})
    ]
  }
}
