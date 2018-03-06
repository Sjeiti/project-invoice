import {
  toPage
  ,basics
  ,getTitle
} from './pi'

describe('Project page',()=>{
  beforeEach(toPage.bind(null,'/client/22/1'))
  context('Basics',basics.bind(null,getTitle('Project'),'Project: Unbranded Metal Keyboard',true))

  context('Features',()=>{

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
          //.type('{ctrl}{shift}{leftarrow}{backspace}Arms')
          //.type('{backspace}{backspace}{backspace}{backspace}{backspace}Arms')
          .type('{backspace}'.repeat('Keyboard'.length) + 'Arms')
      cy.get('h1')
          .should('contain','Project: Unbranded Metal Arms')
      cy.get('.saveable-buttons>:nth-child(1)')
          .should('not.be.disabled')
    })
  })
})