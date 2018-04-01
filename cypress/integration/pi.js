// const base = 'http://pi.ronvalstar.nl'
// const clientNr = 22
// const invoiceNr = 1

const base = 'http://localhost:8080'
const fixtureLsData = 'cypress/fixtures/localStorageData.json'

let currentPage = ''
export const toCurrentPage = ()=>currentPage&&cy.visit(currentPage)

export const toPage = (path = '') => cy.readFile(fixtureLsData).then(json => {
  currentPage = base + path
  cy.visit(base + path,{onBeforeLoad: win => win.localStorage.setItem('data',JSON.stringify(json))})
})

export const describeResponsive = (name,fn)=>{
  describe(name,()=>{
    for (let i=0;i<2;i++) {
      const isDesktop = i===0
      context(isDesktop?'Desktop':'Mobile',()=>{
        beforeEach(()=>isDesktop?cy.viewport(1000,660):cy.viewport(360,640))
        fn()
      })
    }
  })
}

export const getTitle = name => `${name} - Project Invoice`

export const testElementExists = (name,querySelector,exist) => it(`should ${exist?'':'not '}have ${name}`,() => cy.get(querySelector).should(exist?'exist':'not.exist'))

export const assertPathname = pathname=>cy.location().should(location => expect(location.pathname).to.eq(pathname))

export const isDirty = is => cy.get('.saveable-buttons>div>:nth-child(1)').should(is?'not.be.disabled':'be.disabled')

export const elementLanguage = testElementExists.bind(null,'language toggle','.layout section>header>ul',true)
export const elementInvoice = testElementExists.bind(null,'invoice','.invoice.print-invoice',true)

export const basics = (title,heading,isSaveable = false) => {
  it('should have the correct title',()=>{
    cy.title().should('include',title)
  })
  heading!=='' && it('should have the correct heading',()=>{
    cy.get('h1').should('contain',heading)
  })
  testElementExists('saveable buttons','.saveable-buttons>div',isSaveable)
  it('should not have horizontal scrollbar',()=>{
    const body = document.body
    assert.equal(body.offsetWidth,body.scrollWidth)
  })
}
