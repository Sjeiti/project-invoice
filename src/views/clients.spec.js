/* global before, beforeEach, cy, describe, it, expect, assert */

before(() => cy.visitPage('/clients'))

beforeEach(() => cy
    .get('[data-cy=clientList] tbody>tr').as('clientList')
    .get('[data-cy=heading] small').as('indicator')
)

const numCLients = 33
const numCLientFiltered = 3

describe('Project Invoice clients', () => {

  it('should have a list of clients', () => cy
      .get('@clientList').should('have.length', numCLients)
  )

  it('should have a heading indication', () => cy
      .get('@indicator').should('have.text', `(${numCLients})`)
  )

  it('should have a name filtering', () => cy
      .get('th:contains(name) input').type('sons')
      .get('@clientList').should('have.length', numCLientFiltered)
  )

  it('should be able to add a client', () => cy
      .get('[data-cy=newClient]').click()
      .location().should(location=>expect(location.pathname).to.eq(`/client/${numCLients+1}`))
      .get('label:contains(name) input').type('Foobar inc.')
      .get('[data-cy=save]').click()
      .go('back')
  )

  it('should have updated client list', () => cy
      .get('@clientList').should('have.length', numCLients+1)
  )

  it('should have updated client indication', () => cy
      .get('@indicator').should('have.text', `(${numCLients+1})`)
  )
})