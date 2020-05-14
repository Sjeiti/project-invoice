/* global before, beforeEach, cy, describe, it, expect, assert */

before(() => cy.visitPage('/overview'))

beforeEach(() => cy
    .get('[data-cy=years]').as('years')
    .get('[data-cy=quarter]').as('quarters')
)

describe('Project Invoice overview', () => {

  it('should have a list of years', () => cy
      .get('@years').find('a').should('have.length', 6)
      .last().should('have.class', 'current')
  )

  it('should have four quarters', () => cy
      .get('@quarters').should('have.length', 4)
  )

  it('should have csv download enabled for non-empty quarters', () => cy
      .get('@quarters').first().find('tbody>tr').should('have.length', 1)
      .get('@quarters').first().find('button').should('not.be.disabled')
  )

  it('should have csv download disabled for empty quarters', () => cy
      .get('@quarters').last().find('tbody>tr>td').should('have.length', 1)
      .get('@quarters').last().find('button').should('be.disabled')
  )

  it('should have different data for different years', () => cy
      .get('@years').find(':contains(2017)').click()
      .get('@quarters').first().find('tbody>tr').should('have.length', 4)
  )

  it('should have valid sums on quarter footers', () => cy
      .get('@quarters').first().find('tbody>tr').then(trs=>{
        for (var i=0, l=3; i<l; i++) {
          const totalEx = Array.from(trs).reduce((acc, tr)=>acc+parseFloat(cy.$$(tr).find(`td:nth-child(${6+i})`).text()), 0)
          const total = parseFloat(trs.first().parents('table').find(`tfoot td:nth-child(${2+i})`).text())
          expect(totalEx).to.equal(total)
        }
      })
  )
})