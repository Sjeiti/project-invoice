import {toPage} from './pi'

describe('Generic',()=>{

  beforeEach(toPage)

  context('Menu',()=>{

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
})