const marked = require('marked')
    ,utils = require('./utils')
    ,jsdom = require('jsdom')
    ,{JSDOM} = jsdom
    ,commander = require('commander')
        .usage('[options] <files ...>')
        .option('--source [source]', 'Source path')
        .option('--target [target]', 'Target path')
        .parse(process.argv)

marked.setOptions({
  breaks: true
})

utils.read(commander.source)
    .then(marked)
    .then(result=>{
      const dom = new JSDOM(result)
          ,{window} = dom
          ,{document} = window
          ,{body} = document

      const sectionMark = ['H1','H2']

      let element = document.querySelector('body>*')
      const list = [[element]]
      let [sectionArray] = list

      while (element = element.nextSibling) {
        const {nodeName} = element
        if (sectionMark.includes(nodeName)) {
          sectionArray = [element]
          list.push(sectionArray)
        } else {
          sectionArray.push(element)
        }
      }

      const fragment = document.createDocumentFragment()
      list.forEach(sl=>{
        const section = document.createElement('section')
        sl.forEach(elm=>section.appendChild(elm))
        fragment.appendChild(section)
      })

      body.innerHTML = ''
      body.appendChild(fragment)

      // anchor targets
      /*Array.from(body.querySelectorAll('a')).forEach(a=>{
        const {parentNode, textContent} = a
        const href = a.getAttribute('href').replace('https://projectinvoice.nl','')
        const isExternal = /^http/.test(href)
        if (isExternal) {
          a.setAttribute('target','_blank')
        } else {
          const link = document.createElement('Link')
          // link.appendChild(document.createTextNode(textContent))
          link.textContent = textContent
          link.setAttribute('to', href)
          parentNode.insertBefore(link,a)
          parentNode.removeChild(a)
        }
      })*/

      // faq
      const heading = document.getElementById('faq')
      if (heading) {
        element = heading
        list.length = 0
        while (element = element.nextSibling) {
          const {nodeName} = element
          if (nodeName==='H3') {
            sectionArray = [element]
            list.push(sectionArray)
          } else {
            sectionArray.push(element)
          }
        }
        const parent = heading.parentNode
        parent.innerHTML = ''
        parent.appendChild(heading)
        // const afd = document.createElement('app-foldable-definition')
        // const afd = document.createElement('foldable-definition')
        const afd = document.createElement('div')
        afd.classList.add('foldable-definition')
        // afd.setAttribute('data-foldable-definition','foldable-definition')
        parent.appendChild(afd)
        list.forEach(sl=>{
          const dt = document.createElement('dt')
          const dd = document.createElement('dd')
          sl.forEach((elm, i)=>{
            if (i===0) {
              dt.innerHTML = elm.innerHTML
            } else {
              dd.appendChild(elm)
            }
          })
          afd.appendChild(dt)
          afd.appendChild(dd)
        })
      }

      utils.save(commander.target,`<div>${body.innerHTML}</div>`)
    })