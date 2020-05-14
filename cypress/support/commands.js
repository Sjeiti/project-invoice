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

const base = 'http://localhost:4212'
const fixtureLsData = 'cypress/fixtures/localStorageData.json'
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
    (orig, selector, options={}) => {
      console.log('get', {orig, selector, options}) // todo: remove log
      // Cypress.log({message:`get:selector '${selector}'`}) // todo: remove log
      return [orig, selector, options]
    }
    // , (orig, selector, options={}) => {
    //   Cypress.log({message:'bar'}) // todo: remove log
    //   return [orig, selector, options]
    // }
    // , (orig, selector, options={}) => {
    //   const hasText = selector.match(/\{([^}]+)\}/)
    //   const text = hasText&&hasText.pop()
    //   // Cypress.log({message:'hasText '+hasText}) // todo: remove log
    //   if (hasText) {
    //     selector = selector.replace(/\{[^}]+\}/, '')
    //     const realOrig = orig
    //     orig = (selector, options) => realOrig(selector, options).then($result => {
    //       const $ = $result.constructor
    //       const foo = $result.filter((i, elm)=>$(elm).find(`:contains('${text}')`).length)
    //       console.log('foo',$result,foo) // todo: remove log
    //       return $result.filter((i, elm)=>$(elm).find(`:contains('${text}')`).length)
    //     })
    //   }
    //   return [orig, selector, options]
    // }
    , (orig, selector, options={}) => {
      const {update, ignoreLive} = options
      const aliasName = getAliasName(selector)
      const isLive = aliasName && !ignoreLive && asLive.includes(aliasName)
      return [aliasName&&(update||isLive)?cy.updateAlias:orig, selector, options]
      // return aliasName&&(update||isLive)?cy.updateAlias(selector, options):orig(selector, options)
    }
  ]
}

overrides.get&&overrides.get.length&&Cypress.Commands.overwrite('get', (orig, selector, options={}) => {
  const [fn, ...arg] = overrides.get.reduce((acc, fn) => fn(...acc), [orig, selector, options])
  return fn(...arg)
})

/*Cypress.Commands.overwrite('get', (orig, selector, options={}) => {
  const {update, ignoreLive} = options
  const aliasName = getAliasName(selector)
  const isLive = aliasName && !ignoreLive && asLive.includes(aliasName)
  return aliasName&&(update||isLive)?cy.updateAlias(selector, options):orig(selector, options)
})*/

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

Cypress.Commands.add('visitPage', (path = '', options={}) => cy.readFile(fixtureLsData).then(json => cy
  .wrap(base + path).as('currentPage').then(url => cy
    .visit(url, Object.assign({}, options, {
      onBeforeLoad: win => {
        win.localStorage.setItem('data', JSON.stringify(json))
        options.onBeforeLoad&&options.onBeforeLoad(win)
      }
    }))
  )
))

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
