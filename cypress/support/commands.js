/* globals Cypress, cy, expect */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const asLive = []

Cypress.Commands.add('getListElements', () => cy.get('@list').find('li'))
Cypress.Commands.add('updateListElements', () => cy.get('@list').find('li').as('listElements'))

/**
 * Use regex to find alias name
 * @param {string} selector
 * @returns {string}
 */
function getAliasName(selector){
  return (selector.match(/^@(.*)$/)||[])[1]
}

/**
 * Remove an item from an array
 * @param {array} array
 * @param {object} item
 * @returns {boolean}
 */
function removeFromArray(array, item){
  const index = array.indexOf(item)
  const isInArray = index!==-1
  isInArray&&array.splice(index, 1)
  return isInArray
}

/**
 * Return the element itself if it does not have a documentElement reference
 * @param {HTMLElement} elm
 * @returns {HTMLElement}
 */
function getDocumentElement(elm) {
  return elm.documentElement||elm
}

Cypress.Commands.add('updateAlias', (domAlias, options) => {
  const aliasName = getAliasName(domAlias)
  return aliasName&&cy.get(domAlias, {ignoreLive:true}).then($result => {
      const tree = [$result]
      while (tree[0].prevObject) tree.unshift(tree[0].prevObject)
      return tree.reduce(((cy, o)=>cy.find(o.selector)), cy.wrap(getDocumentElement(tree.shift().get(0)))).as(aliasName)
  })||cy.get(domAlias, options)
})

const overrides = {
  get: [
    // (...arg) => [...arg]
    /*(orig, selector, options={}) => {
      // console.log('get1', {orig, selector, options}) // todo: remove log
      // Cypress.log({message:`get:selector '${selector}'`}) // todo: remove log
      return [orig, selector, options]
    }
    ,*/(orig, selector, options={}) => {
      if (selector.substr(0, 1)==='@') {
        const name = selector.substr(1)
        const aliasExists = (Cypress.state('aliases')||{}).hasOwnProperty(name)
        orig = aliasExists?orig:(()=>cy.get(`[data-cy=${name}]`).as(name))
      }
      return [orig, selector, options]
    }
    , (orig, selector, options={}) => {
      const {update, ignoreLive} = options
      const aliasName = getAliasName(selector)
      const isLive = aliasName && !ignoreLive && asLive.includes(aliasName)
      return [aliasName&&(update||isLive)?cy.updateAlias:orig, selector, options]
    }
  ]
}

Object.entries(overrides).forEach(([key, list])=>{
  Cypress.Commands.overwrite(key, (orig, selector, options={}) => {
    const [fn, ...arg] = list.reduce((acc, fn) => fn(...acc), [orig, selector, options])
    return fn(...arg)
  })
})

Cypress.Commands.overwrite('as', (orig, value, name, options={}) => {
  options&&options.live&&!asLive.includes(name)&&asLive.push(name)||options&&options.live===false&&removeFromArray(asLive, name)
  return orig(value, name)
})

Cypress.Commands.add('asAll', () => cy
    .get('[data-cy]')
    .then(list=>{
      list.each((i, {dataset: {cy: name}})=>
          cy.get(`[data-cy=${name}]`).as(name)
      )
    })
)

Cypress.Commands.add('getAs', name => Cypress
  .state('aliases').hasOwnProperty(name)
    ?cy.get('@' + name)
    :cy.get(`[data-cy=${name}]`).as(name)
)

Cypress.Commands.add('visitPage', (path = '', options={}) => {
  const data = {}
  return cy.then(()=>
        ['sessionStorage', 'localStorage', 'cookies'].forEach(type => {
          const file = options[type]||Cypress.config(type)
          file&&cy.readFile(file).then(json=>data[type]=json)
        })
      )
      .wrap(path).then(url => cy
      .visit(url, Object.assign({}, options, {
        onBeforeLoad: win => {
          const {sessionStorage, localStorage, document} = win
          const {sessionStorage:ss, localStorage:ls, cookies} = data
          ss&&Object.entries(ss).forEach(([key, value]) => sessionStorage.setItem(key, JSON.stringify(value)))
          ls&&Object.entries(ls).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)))
          cookies&&(document.cookie = Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join(';'))
          options.onBeforeLoad&&options.onBeforeLoad(win)
        }
      }))
  )
})

Cypress.Commands.add('expectPathname', pathname => cy
  .location().should(location => expect(location.pathname).to.eq(pathname))
)

// Cypress.Commands.add('toCurrentPage', () => cy
//   .get('@currentPage').then(cy.visit)
// )
//
// Cypress.Commands.add('isDirty', is => cy
//   .get('.saveable-buttons>div>:nth-child(1)').should(is?'not.be.disabled':'be.disabled')
// )

Cypress.Commands.add('upload', {prevSubject: 'element'}, (subject, fileName, type) => cy
  .fixture(fileName, 'hex').then(fileHex => {
    if (typeof fileHex!=='string') throw('When uploading json rename your filetype to \'notjson\'. See Cypress issue #7412')
    const bytes = hexStringToByteArray(fileHex)
    const file = new File([bytes], fileName, {type})
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    subject.get(0).files = dataTransfer.files
    return subject
  })
  .trigger('change', {force:true})
)

function hexStringToByteArray(str) {
    return new Uint8Array(str.match(/.{2}|./g).map(s=>parseInt(s, 16)));
}