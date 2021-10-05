/**
 * Run a server `node task/serve [root folder] [port] [security folder]`
 * When security is set `cert.key` and `cer.pem` need to be present.
 * @example
 * node task/serve dist 8383
 * @example
 * // https
 * node task/serve dist 8383 security
 */

const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const https = require('https')

const [,, root='src', port=8183, security] = process.argv

// see https://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node
// in folder containing `/security/req.cnf` run:
// `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256`

const path = folder => `./${folder}/`
const cert = type => [`${path(security)}cert.${type}`, 'utf8']
const serverE = express()
    .use(serveStatic(path(root)))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

;(security
    ? https.createServer({
      key: fs.readFileSync(...cert('key'))
      , cert: fs.readFileSync(...cert('pem'))
      , passphrase: process.env.HTTPS_PASSPHRASE || ''
    }, serverE)
    : serverE
).listen(port)
