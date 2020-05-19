/* global before, beforeEach, cy, describe, it */

const numCLients = 33
const numCLientFiltered = 3

describe('clients', () => {

  before(() => cy.visitPage('/clients'))

  beforeEach(() => cy
      // .asAll()
      .get('@clientList').find('tbody>tr').as('clientListRow')
      .get('@heading').find('small').as('indicator')
  )

  it('should have a list of clients', () => cy
      .get('@clientListRow').should('have.length', numCLients)
  )

  it('should have a heading indication', () => cy
      .get('@indicator').should('have.text', `(${numCLients})`)
  )

  it('should have a name filtering', () => cy
      .get('th:contains(name) input').type('sons')
      .get('@clientListRow').should('have.length', numCLientFiltered)
  )

  it('should be able to add a client', () => cy
      .get('@newClient').click()
      .expectPathname(`/client/${numCLients+1}`)
      .get('label:contains(name) input').type('Foobar inc.')
      .get('@save').click()
      .go('back')
  )

  it('should have updated client list', () => cy
      .get('@clientListRow').should('have.length', numCLients+1)
  )

  it('should have updated client indication', () => cy
      .get('@indicator').should('have.text', `(${numCLients+1})`)
  )
})