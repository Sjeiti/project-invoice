// const base = 'http://pi.ronvalstar.nl'
const base = 'http://localhost:8080'
// const clientNr = 22
// const invoiceNr = 1
const fixtureLsData = 'cypress/fixtures/localStorageData.json'

let currentPage = ''
export const toCurrentPage = ()=>currentPage&&cy.visit(currentPage)

/*const readFileMap = new Map()
const readFile = path=>{
  let returnPromise
  const cached = readFileMap.get(path)
  if (cached) {
    console.log('cached ',cached); // todo: remove log
    returnPromise = Promise.resolve(cached)
  } else {
    returnPromise = cy.readFile(fixtureLsData)
        .then(result=>{
          readFileMap.set(path,result)
          return result
        })
  }
  return returnPromise
}*/

// const fs = require('fs');
// const json = fs.readFileSync(fixtureLsData)
//
// const toPage = (path = '') => {
//   currentPage = base + path
//   return cy.visit(base + path,{onBeforeLoad: win => win.localStorage.setItem('data',json)})
// }

export const toPage = (path = '') => cy.readFile(fixtureLsData).then(json => {
  currentPage = base + path
  cy.visit(base + path,{onBeforeLoad: win => win.localStorage.setItem('data',JSON.stringify(json))})
})

export const getTitle = name => `${name} - Project Invoice`

export const testElementExists = (name,querySelector,exist) => it(`should ${exist?'':'not '}have ${name}`,() => cy.get(querySelector).should(exist?'exist':'not.exist'))

export const assertPathname = pathname=>cy.location().should(location => expect(location.pathname).to.eq(pathname))

export const elementLanguage = testElementExists.bind(null,'language toggle','.layout section>header>ul',true)
export const elementInvoice = testElementExists.bind(null,'invoice','.invoice.print-invoice',true)

export const basics = (title,heading,isSaveable = false) => {
  it('should have the correct title',()=>{
    cy.title().should('include',title)
  })
  heading!=='' && it('should have the correct heading',()=>{
    cy.get('h1').should('contain',heading)
  })
  testElementExists('saveable buttons','.saveable-buttons',isSaveable)
}

