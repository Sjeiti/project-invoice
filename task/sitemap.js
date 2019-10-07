const utils = require(__dirname+'/util/utils')
const save = utils.save
const read = utils.read

const base = 'https://projectinvoice.nl'
const date = (new Date).toISOString().split('T').shift()
// :clientNr :projectIndex :year
// const replaces = {clientNr:1,projectIndex:0,year:2018}
// :clientNr :projectIndex :year
read('./src/config/routes.js')
  .then(source=>source.match(/{\s*path\s*:\s*'([^']*)'/g)||[])
  .then(matches=>matches
    .map(match=>match.match(/{\s*path\s*:\s*'([^']*)'/)||[])
    .map(match=>match[1])
    .filter(match=>match!=='**')
    // .map(rs=>(console.log('rs',rs),rs))
    .map(match=>match.replace(':clientNr',1))
    .map(match=>match.replace(':projectIndex',0))
    .map(match=>match.replace(':year',2018))
    .map(match=>match.replace(':reminderNr',0))
    // .map(rs=>(console.log('rs',rs),rs))
    .map(path=>`<url><loc>${base}${path}</loc><lastmod>${date}</lastmod></url>`)
  )
  .then(rs=>(console.log('rs',rs),rs))
  .then(result=>save('public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${result.join('')}</urlset>`))