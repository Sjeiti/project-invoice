module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/favicon.ico',
    'dist/**/*.css',
    'dist/**/*.js',
    'dist/**/*.svg'
  ]
};