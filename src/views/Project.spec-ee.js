import {
  basics
  ,getTitle
  ,describeResponsive
} from './pi'

describeResponsive('Project page',()=>{

  beforeEach(()=>{
    cy
        .visitPage('/client/22/1')
        .get('.tabs').next().next().as('header')
  })

  context('Basics',basics.bind(null,getTitle('Project'),'Project: Unbranded Metal Keyboard',true))

  context('Main properties',()=>{

    it('should navigate to project',()=>cy
      .title().should('include','Project')
      .get('h1').should('contain','Project: Unbranded Metal Keyboard')
    )

    it('should change name field',()=>cy
      .get('.saveable-buttons>div>:nth-child(1)').should('be.disabled')
      .get('dt').contains('description').find('+dd>input').focus()
      // .type('{rightarrow}{ctrl}{shift}{leftarrow}{backspace}Arms')
      //.type('{backspace}{backspace}{backspace}{backspace}{backspace}Arms')
      .type('{backspace}'.repeat('Keyboard'.length) + 'Arms')
      .get('h1').should('contain','Project: Unbranded Metal Arms')
      .get('.saveable-buttons>div>:nth-child(1)').should('not.be.disabled')
    )

    it('should change price indication when hourly rate is set',()=>cy
      .isDirty(false)
      .get('label[for=projectProperties]').click()
      .get('dt').contains('hourly rate').find('+dd input[type=number]').focus().type('300')
      .get('.discount > .input').should('contain','255')
      .isDirty(true)
    )

    it('should not change price indication when discount is set',()=>cy
      .isDirty(false)
      .get('label[for=projectProperties]').click()
      .get('dt').contains('discount').find('+dd input').focus().type('10')
      .get('tbody > :nth-child(1) div.input.mono').should('contain','0')
      .isDirty(true)
    )

    it('should not change price indication when discount is set',()=>cy
      .isDirty(false)
      .get('label[for=projectProperties]').click()
      .get('dt').contains('paid').find('+dd label').click()
      .isDirty(true)
    )

  })

  context('Lines',()=>{

    it('should add lines',()=>cy
      .isDirty(false)
      .get('tbody > tr').should('have.length',7)
      .get('button').contains('add line').scrollIntoView().click()
      .isDirty(true)
      .get('tbody > tr').should('have.length',8)
    )

    it('should affect hourly rate indicator when hours are changed',()=>cy
      .isDirty(false)
      .get('tbody > tr').should('have.length',7)
      .get('tbody > tr:first-child button').scrollIntoView().click()
      .isDirty(true)
      .get('tbody > tr').should('have.length',6)
    )

    it('should delete lines',()=>cy
      .isDirty(false)
      .get('tbody > tr').should('have.length',7)
      .get('tbody > tr:first-child button').scrollIntoView().click()
      .isDirty(true)
      .get('tbody > tr').should('have.length',6)
    )

    it('should display the correct totals',() => {
      const totals = []
      cy.get('tbody tr')
          .each(tr => {
            const amount = parseInt(tr.find('td:nth-child(5) > input').val(),10)
            const vat = parseInt(tr.find('td:nth-child(6) > select').val(),10)
            totals.push([amount,vat])
          })
          .then(() => cy.get('tfoot tr:first-child :nth-child(5) > .input').should('have.text',totals.map(a => a[0]).reduce((a,b) => a + b,0).toFixed(2)))
    })

  })

  context('invoices',()=>{

    // const header = ()=>cy.get('.tabs').next().next()
    // cy.get('.tabs').next().next().as('header')

    it('should add invoices',()=>cy
      .get('@header').scrollIntoView()
      .get('@header').find('li').should('have.length',4)
      .get('@header').find('header>button').click()
      .get('[type="submit"]').click()
      .get('@header').find('li').should('have.length',5)
    )

    it('should not be dirty when invoices are added',()=>cy
      .isDirty(false)
      .get('@header').scrollIntoView()
      .get('@header').find('header>button').click()
      .get('[type="submit"]').click()
      .isDirty(false)
    )

    it('should be dirty when date is changed',()=>cy
      .isDirty(false)
      .get(':nth-child(1) > .text-align-right > button')
      .get('@header').find('li:first-child button').click()
      .get('dialog input[type=date]').focus().type('2017-05-05')
      .get('[type="submit"]').click()
      .isDirty(true)
    )

    it('should be dirty when checkboxes are changed',()=>cy
      .isDirty(false)
      .get(':nth-child(1) > .text-align-right > button')
      .get('@header').find('li:nth-child(2) button').click()
      .get('dialog .checkbox').click()
      .get('[type="submit"]').click()
      .isDirty(true)
    )

    it('should delete invoices',()=>cy
      .isDirty(false)
      .get('@header').scrollIntoView()
      .get('@header').find('li').should('have.length',4)
      .get('@header').find('li:last-child() button:first-child').click()
      .get('@header').find('li').should('have.length',3)
      .isDirty(true)
    )

    it('should have no checkboxes on first invoice',()=>cy
      .get('@header').find('li:nth-child(1) button').click()
      .get('dialog .checkbox').should('have.length',0)
    )

    it('should have one checkbox on second invoice',()=>cy
      .get('@header').find('li:nth-child(2) button').click()
      .get('dialog .checkbox').should('have.length',1)
    )

    it('should have two checkboxes on third invoice and up',()=>cy
      .get('@header').find('li:nth-child(3) button').click()
      .get('dialog .checkbox').should('have.length',2)
    )

    it('should link to invoice print page',()=>cy
      .get('@header').find('li:first-child a').click()
      .path('/client/22/1/invoice')
    )

  })

})
