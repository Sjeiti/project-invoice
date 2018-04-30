const utils = require(__dirname+'/util/utils')
const save = utils.save
const read = utils.read
const glomise = utils.glomise
const fileBase = './i18n/base.json'
const globSrc = './src/**/*.+(vue|js)'
const globFiles = './public/static/i18n/*.json'

// todo: implement       ar" v-__>made with <span clas

Promise.all([
    readSrc(globSrc,fileBase)
    ,readExisting(globFiles)
])
    .then(([keys,[paths,contents]])=>{
      contents.forEach((content,i)=>{
        let added = false
        for (let key in keys){
          if (!content.hasOwnProperty(key)){
            content[key] = key
            added = true
          }
        }
        added&&save(paths[i],JSON.stringify(content,null,2))
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
    .then(paths=>Promise.all(paths.map(read)))
    .then(rslt=>rslt.join('').match(/__\('([^']+)'\)/g))
    .then(rslt=>rslt.map(fn=>fn.replace(/^__\('|'\)$/g,'')))
    .then(rslt=>(console.log(`found ${rslt.length} keys`),rslt))
    .then(rslt=>rslt.reduce((o,s)=>(o[s]=s,o),{}))
    .then(obj=>(save(target,JSON.stringify(obj)),obj))
}

/**
 * Read existing localisation files
 * @param {string} globFiles
 * @returns {Promise}
 */
function readExisting(globFiles){
  return glomise(globFiles)
    .then(paths=>Promise.all([
        Promise.resolve(paths)
        ,Promise.all(paths.map(path=>read(path).then(JSON.parse)))
    ]))
}