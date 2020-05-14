/* global before, beforeEach, cy, describe, it */

const clientUri = '/client/20'
const projectUri = `${clientUri}/114`
const projectUriClone = `${clientUri}/115`
const projectUriPrevious = `${clientUri}/73`
const projectDescription = 'Two barrels of pig food'
const projectLine1 = 'Digging up a ton of potatoes'
const projectLine2 = 'Peeling all the potatoes'

before(() => cy
    .visitPage(clientUri)
    .get('[data-cy=newProject]').click()
)

beforeEach(() => cy
    .asAll()
    .get('label:contains(discount) input').first().as('discountInput')
)

describe('project', () => {

  it('should have an editable description', () => cy
    .get('label:contains(description) input').first().type(projectDescription)
    .get('[data-cy=projectHeading]').should('have.text', projectDescription)
  )

  it('should save', () => cy
      .get('@save').should('be.enabled')
      .click()
      .should('be.disabled')
  )

  it('should link back to the original client', () => cy
      .get('[data-cy=clientLink]').click()
      .expectPathname(clientUri)
      .go('back')
  )

  it('should have forward / back buttons', () => cy
      .expectPathname(projectUri)
      .get('@nextProject').should('have.attr', 'disabled')
      .get('@previousProject').click()
      .expectPathname(projectUriPrevious)
      .get('@nextProject').click()
      .expectPathname(projectUri)
  )

  it('should be able to clone', () => cy
      .get('@clone').click()
      .get('[data-cy=projectHeading]').should('have.text', projectDescription+' (clone)')
      .expectPathname(projectUriClone)
      .get('@delete').click()
      .expectPathname(clientUri)
      .get(`tr:contains(${projectDescription})`).click()
      .expectPathname(projectUri)
  )

  it('should have hidden options', () => cy
      .get('@discountInput').should('not.be.visible')
      .get('label[for=projectProperties]').click()
      .get('@discountInput').should('be.visible')
  )

  it('should be able to add lines', () => cy
      .get('@linesSection').find('tbody td').should('have.length', 1)
      .get('@newLine').click()
      .get('@linesSection').find('tbody td').should('have.length', 5)
      .find('input').first().type(projectLine1)
      .tab().type('400')
      .get('@linesSection').find('select').select('21')
      .get('@newLine').click()
      .get('@linesSection').find('tbody tr').last()
      .find('input').first().type(projectLine2)
      .tab().type('700')
      .get('@linesSection').find('tbody tr').last().find('select').select('6')
  )

  it('should be able to delete lines', () => cy
      .get('@newLine').click()
      .get('@linesSection').find('tbody tr').should('have.length', 3)
      .get('@linesSection').find('tbody tr').last()
      .find('input').first().type(projectLine2)
      .get('@linesSection').find('tbody tr').last()
      .find('button').last().click()
      .get('@linesSection').find('tbody tr').should('have.length', 2)
  )

  it('should display totals', () => cy
      .get('@totalExVAT').should('have.text', (1100).toFixed(2))
      .get('@totalIncVAT').should('have.text', (400*1.21 + 700*1.06).toFixed(2))
  )

  // it('should have quotation tab selected without invoices', () => cy
  //
  // )


})