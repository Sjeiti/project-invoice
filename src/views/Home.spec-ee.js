import {
  basics
  ,describeResponsive
} from './pi'

describeResponsive('Home',()=>{

  beforeEach(()=>{
    cy.visitPage()
  })

  context('Basics',basics.bind(null,'Project Invoice','',false))

  context('Jumbotron',()=>{
    it('should have link to about',()=>cy
      .get('.jumbotron a').contains('read more').click()
      .path('/about')
    )
    it('should have button for closing',()=>cy
      .get('.jumbotron').should('exist')
      .get('.jumbotron button').contains('hide message').click()
      .get('.jumbotron').should('not.exist')
      .toCurrentPage()
      .get('.jumbotron').should('not.exist')
    )
  })

  context('Buttons',()=>{
    it('should create a new client',()=>cy
      .get('section:first-child *').contains('new client').click()
      .path('/client/34')
    )
    it('should create a new project for latest client',()=>cy
      .get('section:first-child *').contains('Create project').click()
      .path('/client/22/2')
    )
    it('should clone the latest project',()=>cy
      .get('section:first-child *').contains('Clone project').click()
      .path('/client/22/2')
    )
    it('should go to current quarter',()=>cy
      .get('section:first-child *').contains('current quarter').click()
      .path('/overview/quarter')
    )
  })

  context('Open invoices project list',()=>{
    it('should have the correct headers',()=>{
      ['paid','date','description','totalIncDiscounted','actions']
          .forEach(id=>cy.get(`section:nth-child(2) .th-${id}`).should('exist'))
    })
  })

  context('Draft projects list',()=>{
    it('should have the correct headers',()=>{
      ['clientName','description','totalIncDiscounted','actions']
          .forEach(id=>cy.get(`section:nth-child(3) .th-${id}`).should('exist'))
    })
  })

})