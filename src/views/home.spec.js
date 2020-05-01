/* global cy */

beforeEach(() => {
  cy.visit('http://localhost:4212/')
})

describe('Project Invoice home', () => {
  it('should have collapseable jumbotron', () => {
    cy
        .get('[data-cy=jumbotron]').as('jumbotron')
        .get('@jumbotron').should('be.visible')
        .get('[data-cy=hideJumbotron]').click()
        .get('@jumbotron').should('not.be.visible')
        .get('a[href="/settings"]').click()
        .get('[data-cy=homeMessage]').click()
        .get('[data-cy=save]').click()
        .get('a[href="/"]').first().click()
        .get('@jumbotron').should('be.visible')
  })
})