module.exports = {
  lintOnSave: true
  ,configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
    /*,rules: [
        {
            test: /\.html$/
            ,exclude: /node_modules/
            ,use: {loader: 'html-loader'}
        }
    ]*/
  }
  ,pwa: {
    themeColor: '#3a5e70'
  }
}