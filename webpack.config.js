const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './src/index.js'
  ,output: {
    path: path.resolve(__dirname, 'dist')
    ,filename: 'bundle.js'
  }
  ,devServer: {
    contentBase: './public'
    ,port: 4212
    ,historyApiFallback: true
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
      // ,_ENV: JSON.stringify(env||{})
    })
  ]
}
