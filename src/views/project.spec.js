/* global before, beforeEach, cy, describe, it */

const clientUri = '/client/20'
const projectUri = `${clientUri}/114`
const projectUriQuotation = `${clientUri}/114/quotation`
const projectUriInvoice = `${clientUri}/114/invoice`
const projectUriReminder = `${clientUri}/114/reminder/1`
const projectUriClone = `${clientUri}/115`
const projectUriPrevious = `${clientUri}/73`
const projectDescription = 'Pig food'
const projectLine1 = 'Get potatoes'
const projectLine2 = 'Peel potatoes'
const quotationDate = '2020-03-15'
const invoiceDate = '2020-04-15'

describe('project', () => {

  before(() => cy
      .visitPage(clientUri)
  )

  beforeEach(() => cy
      // .get('label:contains(discount) input').first().as('discountInput')
  )

  it('should have an editable description', () => cy
    .get('@newProject').click()
    .get('label:contains(description) input').first().type(projectDescription)
    .get('@projectHeading').should('have.text', projectDescription)
  )

  it('should save', () => cy
      .get('input[type=text]').first().type('My project')
      .get('@save').should('be.enabled')
      .click()
      .should('be.disabled')
  )

  it('should link back to the original client', () => cy
      .get('@clientLink').click()
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

  // todo: fix pathname tests (relative)
  it('should be able to clone', () => cy
      .visitPage(clientUri)
      .get('@newProject').click()
      .get('label:contains(description) input').first().type(projectDescription)
      .get('@save').click()
      .get('@clone').click()
      .get('@projectHeading').should('have.text', projectDescription+' (clone)')
      // .expectPathname(projectUriClone)
      .get('@delete').click()
      // .expectPathname(clientUri)
      // .get(`tr:contains(${projectDescription})`).click()
      // .expectPathname(projectUri)
  )

  it('should have hidden options', () => cy
      .visitPage(clientUri)
      .get('@clientProjects').find('tbody>tr:first-child>td:nth-child(3)').click()
      .get('label:contains(discount) input').first().as('discountInput')
      .get('@discountInput').should('not.be.visible')
      .get('label[for=projectProperties]').click()
      .get('@discountInput').should('be.visible')
  )

  it('should be able to add lines', () => cy
      .visitPage(clientUri)
      .get('@newProject').click()
      .get('@linesSection').find('tbody td').should('have.length', 0)
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

  it('should have quotation tab selected without invoices', () => cy
      .get('@tabInvoices').should('not.exist')
      .get('@tabQuotation').should('be.visible')
      .get('@tabs').find('nav button:contains(invoices)').click()
      .updateAlias('@tabInvoices')
      .get('@tabInvoices').should('be.visible')
      .get('@tabs').find('nav button:contains(quotation)').click()
  )

  it('should able to create a quotation', () => cy
      .visitPage(clientUri)
      .get('@newProject').click()
      .get('input[type=text]').first().type(projectDescription)
      .get('@save').click()
      // .get('@clientProjects').find('tbody>tr:first-child>td:nth-child(3)').click()
      .get('@tabQuotation').find('label:contains(date) input').first()
      .type(quotationDate)
      .tab().type(quotationDate)
      .tab().type('14')
      .tab().type(projectDescription)
      .tab().type('Here is the quotation')
      .get('@tabQuotation').find('label:contains(text after) input').first()
      .type('Kind regards etc')
      .get('@save').click()
      .get('@showQuotation').click()
      .get('@printIframe').then($iframe=>{
        const iframe = $iframe.get(0)
        const {contentDocument:{body}} = iframe
        cy.wrap(body).get(`:contains(${projectDescription})`)
      })
      .go('back')
  )

  it('should be able to add invoices', () => cy
      .get('@tabs').find('nav button:contains(invoices)').click()
      .asAll()
      .get('@tabInvoices').should('be.visible')
      .get('@invoices').find('li').should('have.length', 0)
      .get('@addInvoice').click()
      .get('@save').click()
      .get('@invoices').find('li').should('have.length', 1)
      .find('a:contains(invoice)').click()
      .expectPathname(projectUriInvoice)
      .go('back')
  )

  it('should be able to add reminder', () => cy
      .get('@addInvoice').click()
      .get('@save').click()
      .get('@invoices').find('li').should('have.length', 2)
      .find('a:contains(reminder)').click()
      .expectPathname(projectUriReminder)
      .go('back')
  )

  it('should be able set invoice date', () => cy
      .get('@invoices').find('li').first().find('button').last().click()
      .get('@dialog').find('input').first().type(invoiceDate)
      .get('@dialog').find('button:contains(ok)').click()
      .get('@save').click()
      .get('@invoices').find('li').first().find(`div:contains(${invoiceDate})`).should('exist')
  )


})
