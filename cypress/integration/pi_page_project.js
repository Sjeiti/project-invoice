import {
  toPage
  ,basics
  ,getTitle
  ,isDirty
  ,describeResponsive
  ,assertPathname
} from './pi'

describeResponsive('Project page',()=>{

  beforeEach(toPage.bind(null,'/client/22/1'))

  context('Basics',basics.bind(null,getTitle('Project'),'Project: Unbranded Metal Keyboard',true))

  context('Main properties',()=>{

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
      isDirty(false)
      cy.get('dt').contains('hourly rate').find('+dd input').focus().type('77')
      cy.get('tbody > :nth-child(1) div.input.mono').should('contain','231')
      isDirty(true)
    })

    it('should not change price indication when discount is set',()=>{
      isDirty(false)
      cy.get('dt').contains('discount').find('+dd input').focus().type('10')
      cy.get('tbody > :nth-child(1) div.input.mono').should('contain','0')
      isDirty(true)
    })

    it('should not change price indication when discount is set',()=>{
      isDirty(false)
      cy.get('dt').contains('paid').find('+dd label').click()
      isDirty(true)
    })

  })

  context('Lines',()=>{

    it('should add lines',()=>{
      isDirty(false)
      cy.get('tbody > tr').should('have.length',7)
      cy.get('button').contains('add line').scrollIntoView().click()
      isDirty(true)
      cy.get('tbody > tr').should('have.length',8)
    })

    it('should affect hourly rate indicator when hours are changed',()=>{
      isDirty(false)
      cy.get('tbody > tr').should('have.length',7)
      cy.get('tbody > tr:first-child button').scrollIntoView().click()
      isDirty(true)
      cy.get('tbody > tr').should('have.length',6)
    })

    it('should delete lines',()=>{
      isDirty(false)
      cy.get('tbody > tr').should('have.length',7)
      cy.get('tbody > tr:first-child button').scrollIntoView().click()
      isDirty(true)
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

  context('invoices',()=>{

    const header = ()=>cy.get('header').contains('invoices').parent()

    it('should add invoices',()=>{
      header().scrollIntoView()
      header().next().find('li').should('have.length',4)
      header().find('button').click()
      header().next().find('li').should('have.length',5)
    })

    it('should not be dirty when invoices are added',()=>{
      isDirty(false)
      header().scrollIntoView().find('button').click()
      isDirty(false)
    })

    it('should be dirty when date is changed',()=>{
      isDirty(false)
      header().next().find('li:first-child input[type=date]').focus().type('2017-05-05')
      isDirty(true)
    })

    it('should be dirty when checkboxes are changed',()=>{
      isDirty(false)
      header().next().find('li:nth-child(2) .checkbox').click()
      isDirty(true)
    })

    it('should delete invoices',()=>{
      isDirty(false)
      header().scrollIntoView()
      header().next().find('li').should('have.length',4)
      header().next().find('li:first-child button').click()
      header().next().find('li').should('have.length',3)
      isDirty(true)
    })

    it('should have no checkboxes on first invoice',()=>{
      header().next().find('li:nth-child(1) .checkbox').should('have.length',0)
    })

    it('should have one checkbox on second invoice',()=>{
      header().next().find('li:nth-child(2) .checkbox').should('have.length',1)
    })

    it('should have two checkboxes on third invoice and up',()=>{
      header().next().find('li:nth-child(3) .checkbox').should('have.length',2)
    })

    it('should link to invoice print page',()=>{
      header().scrollIntoView().next().find('li:first-child a').click()
      assertPathname('/client/22/1/invoice')
    })

  })

})
