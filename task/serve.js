/**
 * node task/serve dist 8383
 */

const express = require('express')
  ,bodyParser = require('body-parser')
  ,serveStatic = require('serve-static')
  ,openBrowser = require('open')
  ,root = process.argv[2]||'src'
  ,port = process.argv[3]||8183

express()
    .use(serveStatic('./'+root+'/'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .listen(port)

openBrowser('http://localhost:'+port)

