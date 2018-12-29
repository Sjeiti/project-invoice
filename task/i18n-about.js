const utils = require(__dirname + '/util/utils')
const copy = utils.copy
const exec = utils.exec
const glomise = utils.glomise
const fileReadMe = './README.md'
const fileReadMeEn = './public/static/i18n/README-en.md'
const globFiles = './public/static/i18n/*.json'
const taskToExec = locale=>`node task/parseMarkdown --source=public/static/i18n/README-${locale}.md --target=public/static/i18n/About-${locale}.html`

Promise.all([copy(fileReadMe,fileReadMeEn),glomise(globFiles)])
    .then(result=>
      Promise.all(result[1].map(s=>
        exec(taskToExec(s.split(/\//g).pop().split(/\./g).shift()))
      ))
    )
