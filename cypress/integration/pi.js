// const base = 'http://pi.ronvalstar.nl'
const base = 'http://localhost:8080'
const fixtureLsData = 'cypress/fixtures/localStorageData.json'

describe('Project invoice',()=>{

  context('Main',()=>{

    beforeEach(()=>{
      // load the data fixture into localStorage asap
      cy.readFile(fixtureLsData)
        .then(json=>cy.visit(base,{onBeforeLoad:win=>win.localStorage.setItem('data',JSON.stringify(json))}))
    })

    it('should have the correct title',()=>{
      cy.title().should('include','Project Invoice')
    })

    it('should open overview page',()=>{
      cy.get('nav a[href="/overview"]').click()
      cy.title().should('include','Overview')
    })

    it('should open quarter page',()=>{ // todo: cypress cannot css hover
      // cy.get('nav a[href="/overview"]').invoke('mouseenter') // mouseover mouseenter
      // cy.get('nav a[href="/overview/quarter"]').click()
      cy.get('section a[href="/overview/quarter"]').click()
      cy.title().should('include','Quarter')
    })

  })

  context('Project page',()=>{

    beforeEach(()=>{
      // load the data fixture into localStorage asap
      cy.readFile(fixtureLsData)
        .then(json=>cy.visit(base+'/client/20/4',{onBeforeLoad:win=>win.localStorage.setItem('data',JSON.stringify(json))}))
    })

    it('should navigate to project',()=>{
      cy.title().should('include','Project')
      cy.get('h1').should('contain','Project: Sleek Plastic Shoes')
    })

    it('should change name field',()=>{
      cy.get('.saveable-buttons>:nth-child(1)')
        .should('be.disabled')
      cy.get('dt').contains('description')
        .find('+dd>input')
        .focus()
        .type('{backspace}{backspace}{backspace}{backspace}{backspace}Arms')
      cy.get('h1')
        .should('contain','Project: Sleek Plastic Arms')
      cy.get('.saveable-buttons>:nth-child(1)')
        .should('not.be.disabled')
    })

  })

})
