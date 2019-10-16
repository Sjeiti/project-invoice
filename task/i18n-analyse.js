const utils = require(__dirname + '/util/utils')
const sluggify = require(__dirname + '/util/sluggify')
const save = utils.save
const read = utils.read
const glomise = utils.glomise
const fileBase = './i18n/base.json'
const globSrc = './src/**/*.+(vue|js)'
const globFiles = './public/static/i18n/*.json'
const rxMatch = /\$t\('([^|']+)'\)|v-_="'[^|'"]*|v-__?[^>]*>[^<]*/g
const rxReplace = /^\$t\('|'\)$|v-_="'|v-__?[^>]*>/g

// todo: fix for react

Promise.all([readSrc(globSrc,fileBase),readExisting(globFiles)])
    .then(([keys,[paths,contents]]) => {
      contents.forEach((content,i) => {
        const path = paths[i]
        let key
        let added = false
        for (key in keys) {
          if (!content.hasOwnProperty(key)) {
            content[key] = keys[key]
            added = true
          }
        }
        added && save(path,JSON.stringify(content,null,2))
        //
        const unused = []
        for (key in content){
          !keys.hasOwnProperty(key) && unused.push(key)
        }
        unused.length && console.log(`unused keys in ${path.match(/\w+\.\w+$/).pop()}: ${unused.map(s => `'${s}'`).join(', ')}`)
      })
    })

/**
 * Read source files for __('\w')
 * @param {string} src
 * @param {string} target
 * @returns {Promise}
 */
function readSrc(src,target){
  return glomise(src)
      .then(paths => Promise.all(paths.map(read)))
      .then(rslt => rslt.join('').match(rxMatch)) // match js and directives
      // .then(rslt=>(console.log(rslt),rslt))
      .then(rslt => rslt.map(fn => fn.replace(rxReplace,''))) // clean matches
      .then(rslt => rslt.filter(s => s!=='' && s.substr(0,2)!=='{{')) // don't match interpolations
      // .then(rslt=>(console.log(rslt),rslt))
      .then(rslt => (console.log(`found ${rslt.length} keys`),rslt))
      .then(rslt => rslt.reduce((o,s) => (o[sluggify(s)] = s,o),{}))
      // .then(rslt=>(console.log(rslt),rslt))
      .then(obj => (save(target,JSON.stringify(obj)), obj))
}

/**
 * Read existing localisation files
 * @param {string} globFiles
 * @returns {Promise}
 */
function readExisting(globFiles) {
  return glomise(globFiles)
      .then(paths => Promise.all([Promise.resolve(paths),Promise.all(paths.map(path => read(path).then(JSON.parse)))]))
}
