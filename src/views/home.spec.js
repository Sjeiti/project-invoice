/* global beforeEach, cy, describe, it */

const clientName = 'ClientWhoPays'
const projectName = 'CoolProject'

describe('home', () => {

  beforeEach(() => {
    cy.visitPage('/')
  })

  it('should have collapseable jumbotron', () => cy
      .get('@jumbotron').should('be.visible')
      .get('@hideJumbotron').click()
      .get('@jumbotron').should('not.exist')
      .get('a[href="/settings"]').click()
      .get('@homeMessage').click()
      .get('@save').click()
      .get('a[href="/"]').first().click()
      .get('@jumbotron').should('be.visible')
  )
  it('should have action buttons', () => cy
      .get('@newClient').should('exist').click()
      .get('label:contains(name)').click()
      .type(clientName)
      .get('h3').first().should('contain', clientName)
      .go('back')

      .get('@newProjectClient').should('exist').click()
      .get('label:contains(description)').first().click()
      .type(projectName)
      .get('@projectHeading').should('contain', projectName)
      .go('back')

      .get('@cloneProject').should('exist').click()
      .get('@projectHeading').should('contain', '(clone)')
      .go('back')

      .get('@linkQuarter').should('exist').click()
      .expectPathname('/overview')
      .go('back')
  )
  it('should have open invoices', () => cy
      .get('@openInvoices').find('tr:contains(Cheese)').as('cheese').find('button').should('exist')
      .click()
      .get('button:contains(add reminder)').click()
      .get('@save').click()
      .go('back')
      .get('@cheese').find('button').should('not.exist')
  )
  it('should have draft projects', () => cy
      .get('@draftProjects').find('tr:contains(Concrete)').as('concrete').click()
      .get('button:contains(invoices)').click()
      .get('@invoices').find('li').should('have.length', 0)
      .get('@addInvoice').click()
      .get('@save').click()
      .go('back')
      .get('@concrete').should('not.exist')
      .get('@draftProjects').find('tr:contains(Metal)').as('metal').find('button').click()
      .go('back')
      .get('@metal').should('not.exist')
  )
})
