const utils = require(__dirname + '/util/utils')
const save = utils.save
const glomise = utils.glomise
const fileI18nConfig = './src/config/i18n.js'
const globFiles = './public/static/i18n/*.json'

glomise(globFiles)
    .then(filePaths=>filePaths.map(path=>path.match(/([^/]+)\.json$/).pop()))
    .then(isos=>save(fileI18nConfig,'export const I18N_ISO = '+JSON.stringify(isos).replace(/"/g,'\'')))


