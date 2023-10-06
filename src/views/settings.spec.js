/* global before, beforeEach, cy, describe, it, expect */

const copyPasteString = '-copyPasteString-'
const encryptionPassword = 'hnK%dt#!'

describe('overview', () => {

  before(() => cy.visitPage('/settings'))

  it('should be able to set language', () => cy
      .get('@uilang').find('select').as('languageSelect')
      .get('@languageSelect').select('nl')
      .get('@save').click()
      .get('@languageSelect').parent().contains('applicatie taal')
      .get('@languageSelect').select('en')
      .get('@save').click()
  )

  it('should be able to set invoice nr', () => cy
      .get('@projectNumberTemplate').click().find('input').first()
      .type('_')
      .get('@save').click()
      .visit('/client/28/97')
      .get('@invoices').find('li>div:nth-child(2)').contains('2017.12_')
      // .go('back')
      .visit('/settings')
  )

  it('should be able to set csv template', () => cy
      .get('@csvTemplate').click().find('input').first()
      .type(copyPasteString)
      .get('@save').click()
      .visit('/overview')
      .get('@quarter').first().find('button').first().click({native:true})
      // .get('button:contains("copy csv data")').first().click({native:true})
      // .task('getClipboard').should('contain', copyPasteString)  // todo fix clipboard test
  )

  it('should be able to switch currency', () => cy
      .visit('/settings')
      .get('@currency').find('select').as('currencySelect')
      .get('@currencySelect').select('HRK')
      .get('@revert').click() // todo fix
  )

  it('should be able to toggle home message', () => cy
      .visit('/settings')
      .get('header>nav>a').first().click()
      .get('@jumbotron').should('be.visible')
      .go('back')
      .get('@homeMessage').click()
      .get('@save').click()
      .get('header>nav>a').first().click()
      .get('@jumbotron').should('not.exist')
  )

  it('should be able to set invoice languages', () => cy
      .visit('/settings')
      .get('@langs').click().type(',de')
      .get('@save').click()
      .visit('/copy')
      .get('@languages').find('button').last().should('contain', 'de')
      // .go('back')
  )

  it('should be able to set color scheme', () => cy
      .visit('/settings')
      .get('@colorScheme')
      .click()
      .click() // todo test
  )

  it('should be able download the current data', () => cy
      .visit('/settings')
      .get('@download').then(elm=>{
        const href = elm.attr('href')
        const download = elm.attr('download')
        expect(download).to.match(/^data_20\d\d\-\d\d\-\d\d\.json/)
        let data = null
        try{
          data = JSON.parse(unescape(href).match(/,(.+)/).pop())
        } catch(err) {}
        ([
            'timestamp'
            , 'version'
            , 'clients'
            , 'config'
            , 'copy'
            , 'personal'
        ]).forEach(prop => expect(data).to.have.property(prop))
      })
  )

  it('should be able to clear all data', () => cy
      .visit('/settings')
      .get('@inputFile').upload('upload.json_', 'text/json')
      .get('@clientsLength').should('contain', '(33)')
      // .get('@clientsLength').should('not.contain', '(1)')
      .get('@clear').click()
      .get('@clientsLength').should('contain', '(1)')
  )

  // todo: not needed, see previous
  it('should be able to restore data', () => cy
      .visit('/settings')
      .get('@inputFile').upload('upload.json_', 'text/json')
      .get('@clientsLength').should('contain', '(33)')
  )

  it('should show a message when trying to restore wrong data', () => cy
      .visit('/settings')
      .get('@inputFile').upload('uploadInvalid.json_', 'text/json')
      .get('@notifications').should('contain', 'Malformed JSON data.')
      .find('button').click()
      .get('@inputFile').upload('uploadWrong.json_', 'text/json')
      .get('@notifications').should('contain', 'The JSON is missing data specific to Project Invoice.')
      .find('button').last().click()
  )

  it('should show an input field when peer2peer send is clicked', () => cy
      .visit('/settings')
      .get('@p2pSendIntent').click()
      .get('@p2pInput').should('be.visible')
      .get('@p2pSend').should('be.visible')
      .get('@p2pCancel').click()
      .get('@p2pInput').should('not.to.exist')
      .get('@p2pSend').should('not.to.exist')
      .get('@p2pCancel').should('not.to.exist')
  )

  it('should show a QR svg when peer2peer receive is clicked', () => cy
      .visit('/settings')
      .get('@peer').find('input[type=text]').type('{selectall}0.peerjs.com')
      .get('@p2pReceive').click()
      .get('@p2pCode').should('be.visible')
      .get('@p2pQR').should('be.visible')
      .get('@p2pCancel').click()
      .get('@p2pCode').should('not.to.exist')
      .get('@p2pQR').should('not.to.exist')
      .get('@p2pCancel').should('not.to.exist')
  )

  // todo: check 2nd previous test, what is the difference
  // todo: also disabled because flaky
  // it('should wait when sending data', () => cy
  //     .visit('/settings')
  //     .get('@p2pSendIntent').click()
  //     .get('@p2pInput').should('be.visible')
  //     .get('@p2pSend').scrollIntoView().click()
  //     .get('@p2pInput').should('not.to.exist')
  //     .get('@p2pSend').should('not.to.exist')
  //     .get('@p2pCancel').click()
  //     .get('@p2pInput').should('not.to.exist')
  //     .get('@p2pSend').should('not.to.exist')
  //     .get('@p2pCancel').should('not.to.exist')
  // )

  it('should show a hash when peer2peer receive is clicked', () => cy
      .visit('/settings')
      .get('@p2pReceive').click()
      .get('@p2pCancel').prev().should('contain', 'ID: ')
      .get('@p2pCancel').click()
  )

  it('should be able to encrypt localStorage data', () => cy
      .visit('/settings')
      .get('@encryptionEnable').click()
      .get('@dialog').should('be.visible')
      .get('@dialogCancel').click()
      .get('@encryptionEnable').click()
      .get('@password').focus().type(encryptionPassword)
      .get('@dialogConfirm').click()
      .get('@dialog').should('contain', 'Your data is encrypted. Please enter your password.')
      .get('@password').focus().type('wrong'+encryptionPassword)
      .get('@dialogConfirm').click()
      .get('@wrongPassword').should('be.visible')
      .get('@password').focus().clear().type(encryptionPassword)
      .get('@dialogConfirm').click()
      .get('@revert').click() // todo form should not have to revert
      .get('@encryptionDisable').click()
  )

  it('should be able to select cloud provider', () => cy
      .visit('/settings')
      .get('@cloudSelect').select('gdrive')
      .get('@cloudAuthorise').click()
      .get('@cloudRevoke').click()
  )

})
