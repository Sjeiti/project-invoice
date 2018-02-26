const utils = require('./utils')
    ,{glomise,read,save} = utils

Promise.all([
    read('public/static/invoice.appcache')
    ,glomise('dist/**/*')
])
    .then(([appcache,files])=>{
      files = files.map(f=>f.replace('dist/','')).filter(f=>f.split(/\//g).pop().includes('.')&&!f.includes('invoice.appcache'))
      appcache = appcache.replace(/\#files_start([\s\S]*)\#files_end/g,`#files_start\n${files.join('\n')}\n#files_end`)
      save('dist/static/invoice.appcache', appcache)
      save('public/static/invoice.appcache', appcache)
    })

