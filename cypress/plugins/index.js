// tests/e2e/plugins/index.js

// webpack import
const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  on(
    'file:preprocessor',
    webpack({
      webpackOptions: require('@vue/cli-service/webpack.config'),
      watchOptions: {}
    })
  )

  return Object.assign({}, config, {
    // fixturesFolder: 'tests/e2e/fixtures',
    // integrationFolder: 'tests/e2e/specs',
    // screenshotsFolder: 'tests/e2e/screenshots',
    // videosFolder: 'tests/e2e/videos',
    // supportFile: 'tests/e2e/support/index.js'
  })
}


// // cypress/plugins/index.js
// const webpack = require('@cypress/webpack-preprocessor')
// const webpackOptions = {
//   module: {
//     rules: [
//       {
//         test: /\.vue$/,
//         loader: 'vue-loader'
//       }
//     ]
//   }
// }
//
// const options = {
//   // send in the options from your webpack.config.js, so it works the same
//   // as your app's code
//   webpackOptions,
//   watchOptions: {}
// }
//
// module.exports = on => {
//   on('file:preprocessor', webpack(options))
// }