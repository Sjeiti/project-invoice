import {
  toPage
  ,basics
  ,getTitle
} from './pi'

describe('Project page',()=>{
  beforeEach(toPage.bind(null,'/client/22/1'))
  context('Basics',basics.bind(null,getTitle('Project'),'Project: Unbranded Metal Keyboard',true))

  xcontext('Main properties',()=>{

    it('should navigate to project',()=>{
      cy.title().should('include','Project')
      cy.get('h1').should('contain','Project: Unbranded Metal Keyboard')
    })

    it('should change name field',()=>{
      cy.get('.saveable-buttons>:nth-child(1)')
          .should('be.disabled')
      cy.get('dt').contains('description')
          .find('+dd>input')
          .focus()
          // .type('{rightarrow}{ctrl}{shift}{leftarrow}{backspace}Arms')
          //.type('{backspace}{backspace}{backspace}{backspace}{backspace}Arms')
          .type('{backspace}'.repeat('Keyboard'.length) + 'Arms')
      cy.get('h1')
          .should('contain','Project: Unbranded Metal Arms')
      cy.get('.saveable-buttons>:nth-child(1)')
          .should('not.be.disabled')
    })

    it('should change price indication when hourly rate is set',()=>{
      cy.get('.saveable-buttons>:nth-child(1)').should('be.disabled')
      cy.get('dt').contains('hourly rate').find('+dd input').focus().type('77')
      cy.get('tbody > :nth-child(1) div.input.mono').should('contain','231')
      cy.get('.saveable-buttons>:nth-child(1)').should('not.be.disabled')
    })

    it('should not change price indication when discount is set',()=>{
      cy.get('.saveable-buttons>:nth-child(1)').should('be.disabled')
      cy.get('dt').contains('discount').find('+dd input').focus().type('10')
      cy.get('tbody > :nth-child(1) div.input.mono').should('contain','0')
      cy.get('.saveable-buttons>:nth-child(1)').should('not.be.disabled')
    })

    it('should not change price indication when discount is set',()=>{
      cy.get('.saveable-buttons>:nth-child(1)').should('be.disabled')
      cy.get('dt').contains('paid').find('+dd label').click()
      cy.get('h1').scrollIntoView().click() // todo remove when #112 is fixed
      cy.get('.saveable-buttons>:nth-child(1)').should('not.be.disabled')
    })

  })

  context('Lines',()=>{

    it('should add lines',()=>{
      cy.get('.saveable-buttons>:nth-child(1)').should('be.disabled')
      cy.get('tbody > tr').should('have.length',7)
      cy.get('button').contains('add line').scrollIntoView().click()
      cy.get('h3').contains('lines').scrollIntoView().click() // todo remove when #112 is fixed
      cy.get('.saveable-buttons>:nth-child(1)').should('not.be.disabled')
      cy.get('tbody > tr').should('have.length',8)
    })

    it('should affect hourly rate indicator when hours are changed',()=>{
      cy.get('.saveable-buttons>:nth-child(1)').should('be.disabled')
      cy.get('tbody > tr').should('have.length',7)
      cy.get('tbody > tr:first-child button').scrollIntoView().click()
      cy.get('h3').contains('lines').scrollIntoView().click() // todo remove when #112 is fixed
      cy.get('.saveable-buttons>:nth-child(1)').should('not.be.disabled')
      cy.get('tbody > tr').should('have.length',6)
    })

    it('should delete lines',()=>{
      // cy.viewport(320,768)
      cy.get('.saveable-buttons>:nth-child(1)').should('be.disabled')
      cy.get('tbody > tr').should('have.length',7)
      cy.get('tbody > tr:first-child button').scrollIntoView().click()
      cy.get('h3').contains('lines').scrollIntoView().click() // todo remove when #112 is fixed
      cy.get('.saveable-buttons>:nth-child(1)').should('not.be.disabled')
      cy.get('tbody > tr').should('have.length',6)
    })

    it('should display the correct totals',()=>{
      const totals = []
      cy.get('tbody tr')
          .each(tr=>{
            const amount = parseInt(tr.find('td:nth-child(4) > input').val(), 10)
            const vat = parseInt(tr.find('td:nth-child(5) > select').val(), 10)
            totals.push([amount,vat])
          })
          .then(()=>cy.get('tfoot tr:first-child :nth-child(4) > .input').should('have.text', totals.map(a=>a[0]).reduce((a,b)=>a+b,0).toFixed(2)))
    })

  })

})