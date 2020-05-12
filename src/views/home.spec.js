/* global cy */

beforeEach(() => {
  cy.visitPage('/')
})

const clientName = 'ClientWhoPays'
const projectName = 'CoolProject'

describe('Project Invoice home', () => {
  it('should have collapseable jumbotron', () => cy
      .get('[data-cy=jumbotron]').as('jumbotron')
      .get('@jumbotron').should('be.visible')
      .get('[data-cy=hideJumbotron]').click()
      .get('@jumbotron').should('not.be.visible')
      .get('a[href="/settings"]').click()
      .get('[data-cy=homeMessage]').click()
      .get('[data-cy=save]').click()
      .get('a[href="/"]').first().click()
      .get('@jumbotron').should('be.visible')
  )
  it('should have action buttons', () => cy
      .get('[data-cy=newClient]').should('exist').click()
      .get('label:contains(name)').click()
      .type(clientName)
      .get('h3').first().should('contain', clientName)
      .go('back')

      .get('[data-cy=newProjectClient]').should('exist').click()
      .get('label:contains(description)').first().click()
      .type(projectName)
      .get('[data-cy=projectHeading]').should('contain', projectName)
      .go('back')

      .get('[data-cy=cloneProject]').should('exist').click()
      .get('[data-cy=projectHeading]').should('contain', '(clone)')
      .go('back')

      .get('[data-cy=linkQuarter]').should('exist').click()
      .location().should(location =>
        expect(location.pathname).to.eq('/overview/quarter')
      )
      .go('back')
  )
  it('should have open invoices', () => cy
      .get('[data-cy=openInvoices] tr:contains(Cheese)').as('cheese').find('button').should('exist')
      .click()
      .get('button:contains(add reminder)').click()
      .get('[data-cy=save]').click()
      .go('back')
      .get('@cheese').find('button').should('not.exist')
  )
  it('should have draft projects', () => cy
      .get('[data-cy=draftProjects] tr:contains(Concrete)').as('concrete').click()
      .get('button:contains(invoices)').click()
      .get('[data-cy=invoices] li').should('have.length', 0)
      .get('[data-cy=addInvoice]').click()
      .get('[data-cy=save]').click()
      .go('back')
      .get('@concrete').should('not.exist')
      .get('[data-cy=draftProjects] tr:contains(Metal)').as('metal').find('button').click()
      .go('back')
      .get('@metal').should('not.exist')
  )
})