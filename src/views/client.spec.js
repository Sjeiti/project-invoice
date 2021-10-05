/* global before, beforeEach, cy, describe, it, expect, assert */

describe('client', () => {

  before(() => cy.visitPage('/client/1'))

  it('should have a name', () => cy
      .get('@clientNameTitle').then($el=>cy.get('@clientName').should('have.value', $el.text()))
      .get('@clientName').type('hello')
      .get('@clientNameTitle').then($el=>cy.get('@clientName').should('have.value', $el.text()))
  )

  it('should have projects', () => cy
      .get('@clientProjects').find('tbody tr').should('have.length', 3)
  )

  it('should be able to add projects', () => cy
      .get('@newProject').click().go('back')
      .get('@clientProjects').find('tbody tr').should('have.length', 4)
  )
})
