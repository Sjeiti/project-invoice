/* global before, beforeEach, cy, describe, it, expect, assert */

describe('layout', () => {

  before(() => cy.visitPage('/layout'))

  it('should have a hidden printPage and a visible one in an iframe', () => cy
      .get('@iframePage').should('have.class', 'visually-hidden')
      .get('@printIframe').then($iframe=>{
        const iframe = $iframe.get(0)
        const {contentDocument:{body}} = iframe
        const iframePage = body.querySelector('[data-cy="iframePage"]')
        assert(!iframePage.classList.contains('visually-hidden'))
      })
  )

  it('should be able to switch themes', () => cy
      .get('@iframePage').should('not.have.class', 'clean')
      .get('@iframePage').should('not.have.class', 'vertical')
      .get('@themeSelect').select('clean').blur()
      .get('@iframePage').should('have.class', 'clean')
      .get('@iframePage').should('not.have.class', 'vertical')
      .get('@themeSelect').select('vertical')
      .get('@save').click()
      .get('@iframePage').should('not.have.class', 'clean')
      .get('@iframePage').should('have.class', 'vertical')
      .get('@printIframe').should(havePageClass('vertical'))
  )

  it('should be able to add logo image', () => cy
      .get('@addImage').click()
  )

  it('should be able to set colors', () => cy
      .get('@themeMainBgColor').should('have.value', '#ffffff')
      // .get('@printIframe').should(havePageStyle('backgroundColor', 'rgba(0, 0, 0, 0)'))
      // .get('@printIframe').should(havePageStyle('background-color', 'rgba(0, 0, 0, 0)'))
      .get('.mcpicker').should('not.exist')
      .get('@themeMainBgColor').click()
      .get('.mcpicker').should('be.visible').click({x:10, y:10})
      .get('@themeMainBgColor').should('not.have.value', '#ffffff').invoke('val', '#00FF00').trigger('change')
      // .get('@printIframe').should(havePageStyle('backgroundColor', 'rgb(0, 255, 0)'))
      // .get('@printIframe').should(havePageStyle('background-color', 'rgb(0, 255, 0)'))
  )

  it('should be able to set font properties', () => cy
      .get('@fontSizeInput').invoke('val', 30).trigger('change')
      // .get('@printIframe').should(havePageStyle('fontSize', '30px'))
      .get('@fontFamilyMainSelect').select('Scada')
      .get('@fontFamilyCurrencySelect').select('Akronim')
      .get('@printIframe').should(havePageStyle('fontFamily', 'Scada, "Helvetica Neue", Helvetica, Arial, sans-serif'))
  )

  it('should be able to add custom CSS', () => cy
      .get('@printIframe').should(havePageStyle('color', 'rgb(0, 0, 0)'))
      .get('@invoiceCSS').type('* {{}color:red;}')
      .get('@printIframe').should(havePageStyle('color', 'rgb(255, 0, 0)'))
  )

  it('should be able to switch page type and language', () => cy
      .get('@printIframe').should(notHavePageClass('quotation'))
      .get('@pageTypeQuotation').click()
      .get('@printIframe').should(havePageClass('quotation'))
      .get('@pageTypeInvoice').click()
      .get('@printIframe').should(notHavePageClass('quotation'))
      .get('@pageTypeReminder').click()
      .get('@pageLangNl').click()
      .get('@pageLangEn').click()
  )
})

function havePageStyle(property, value){
  return $iframe=>{
    const iframe = $iframe.get(0)
    const {contentDocument:{body}} = iframe
    const page = body.querySelector('[data-cy="iframePage"]')
    expect(page).to.have.css(property, value)
  }
}

function havePageClass(className){
  return pageClass(className, true)
}

function notHavePageClass(className){
  return pageClass(className, false)
}


function pageClass(className, has=true){
  return $iframe=>{
    const iframe = $iframe.get(0)
    const {contentDocument:{body}} = iframe
    const iframePage = body.querySelector('[data-cy="iframePage"]')
    has
      ?expect(iframePage).to.have.class(className)
      :expect(iframePage).not.to.have.class(className)
  }
}
