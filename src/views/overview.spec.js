/* global beforeEach, cy, describe, it, expect, assert */

beforeEach(() => {
  cy.visitPage('/overview')
})

describe('Project Invoice overview', () => {
  it('should have a list of years', () => cy

      .get('[data-cy=years]').as('years')
      .find('a').should('have.length', 6)
      .last().should('have.class', 'current')

      .get('[data-cy=quarter]').should('have.length', 4).as('quarters')
      .first().find('tbody>tr').should('have.length', 1)
      .get('@quarters').first().find('button').should('not.be.disabled')
      .get('@quarters').last().find('tbody>tr>td').should('have.length', 1)
      .get('@quarters').last().find('button').should('be.disabled')

      .get('@years').find(':contains(2017)').click()
      .get('@quarters').first().find('tbody>tr').should('have.length', 4)

      // .get('@quarters').first().find('tbody>tr')
      .then(trs=>{
        for (var i=0, l=3; i<l; i++) {
          const totalEx = Array.from(trs).reduce((acc, tr)=>acc+parseFloat(cy.$$(tr).find(`td:nth-child(${6+i})`).text()), 0)
          const total = parseFloat(trs.first().parents('table').find(`tfoot td:nth-child(${2+i})`).text())
          expect(totalEx).to.equal(total)
        }
      })
  )
  // it('should have action buttons',() => cy
  //     .get('[data-cy=newClient]').should('exist').click()
})