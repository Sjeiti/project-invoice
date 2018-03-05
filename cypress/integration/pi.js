// const base = 'http://pi.ronvalstar.nl'
const base = 'http://localhost:8080'
const clientNr = 22
const invoiceNr = 1
const fixtureLsData = 'cypress/fixtures/localStorageData.json'
const toPage = (path = '') => cy.readFile(fixtureLsData).then(json => cy.visit(base + path,{onBeforeLoad: win => win.localStorage.setItem('data',JSON.stringify(json))}))
const getTitle = name => `${name} - Project Invoice`
const testElementExists = (name,querySelector,exist) => it(`should ${exist?'':'not '}have ${name}`,() => cy.get(querySelector).should(exist?'exist':'not.exist'))
const assertPathname = pathname=>cy.location().should(location => expect(location.pathname).to.eq(pathname))
const elementLanguage = testElementExists.bind(null,'language toggle','.layout section>header>ul',true)
const elementInvoice = testElementExists.bind(null,'invoice','.invoice.print-invoice',true)
const basics = (title,heading,isSaveable = false) => {
  it('should have the correct title',()=>{
    cy.title().should('include',title)
  })
  heading!=='' && it('should have the correct heading',()=>{
    cy.get('h1').should('contain',heading)
  })
  testElementExists('saveable buttons','.saveable-buttons',isSaveable)
}

describe('Generic',()=>{
  beforeEach(toPage)

  context('Menu',()=>{

    it('should open overview page',()=>{
      cy.get('nav a[href="/overview"]').click()
      cy.title().should('include','Overview')
    })

    it('should open quarter page',()=>{ // todo: cypress cannot css hover
      // cy.get('nav a[href="/overview"]').invoke('mouseenter') // mouseover mouseenter
      // cy.get('nav a[href="/overview/quarter"]').click()
      cy.get('section a[href="/overview/quarter"]').click()
      cy.title().should('include','Quarter')
    })
  })
})

describe('Home',()=>{
  beforeEach(toPage)
  context('Basics',basics.bind(null,'Project Invoice','',false))

  context('Jumbotron',()=>{
    it('should have link to about',()=>{
      cy.get('.jumbotron a').contains('read more').click()
      assertPathname('/about')
    })
    it('should have button for closing',()=>{
      cy.get('.jumbotron').should('exist')
      cy.get('.jumbotron button').contains('hide message').click()
      cy.get('.jumbotron').should('not.exist')
      cy.visit(base) // cy.reload()
      cy.get('.jumbotron').should('not.exist')
      //
    })
  })

  context('Buttons',()=>{
    it('should create a new client',()=>{
      cy.get('section:first-child *').contains('new client').click()
      assertPathname('/client/34')
    })
    it('should create a new project for latest client',()=>{
      cy.get('section:first-child *').contains('Create project').click()
      assertPathname('/client/22/2')
    })
    it('should clone the latest project',()=>{
      cy.get('section:first-child *').contains('Clone project').click()
      assertPathname('/client/22/2')
    })
    it('should go to current quarter',()=>{
      cy.get('section:first-child *').contains('current quarter').click()
      assertPathname('/overview/quarter')
    })
  })

  context('Open invoices project list',()=>{
    it('should have the correct headers',()=>{
      ['paid','date','description','totalIncDiscounted','actions']
          .forEach(id=>cy.get(`section:nth-child(2) .th-${id}`).should('exist'))
    })
  })

  context('Draft projects list',()=>{
    it('should have the correct headers',()=>{
      ['clientName','description','totalIncDiscounted','actions']
          .forEach(id=>cy.get(`section:nth-child(3) .th-${id}`).should('exist'))
    })
  })

})

describe('Overview page',()=>{
  beforeEach(toPage.bind(null,'/overview'))
  context('Basics',basics.bind(null,getTitle('Overview'),'Overview',false))
})

describe('Quarter page',()=>{
  beforeEach(toPage.bind(null,'/overview/quarter'))
  context('Basics',basics.bind(null,getTitle('Quarter'),'',false))
})

describe('Clients page',()=>{
  beforeEach(toPage.bind(null,'/clients'))
  context('Basics',basics.bind(null,getTitle('Clients'),'Clients',false))
})

describe('Client page',()=>{
  beforeEach(toPage.bind(null,'/client/22'))
  context('Basics',basics.bind(null,getTitle('Client'),'Client: McLaughlin - Graham',true))
})

describe('Project page',()=>{
  beforeEach(toPage.bind(null,'/client/22/1'))
  context('Basics',basics.bind(null,getTitle('Project'),'Project: Unbranded Metal Keyboard',true))

  context('Features',()=>{

    it('should navigate to project',()=>{
      cy.title().should('include','Project')
      cy.get('h1').should('contain','Project: Unbranded Metal Keyboard')
    })

    it('should change name field',()=>{
      cy.get('.saveable-buttons>:nth-child(1)')
          .should('be.disabled')
      cy.get('dt').contains('description')
          .find('+dd>input')
          .focus()
          //.type('{ctrl}{shift}{leftarrow}{backspace}Arms')
          //.type('{backspace}{backspace}{backspace}{backspace}{backspace}Arms')
          .type('{backspace}'.repeat('Keyboard'.length) + 'Arms')
      cy.get('h1')
          .should('contain','Project: Unbranded Metal Arms')
      cy.get('.saveable-buttons>:nth-child(1)')
          .should('not.be.disabled')
    })
  })
})

describe('Invoice page',()=>{
  beforeEach(toPage.bind(null,'/client/22/1/invoice'))
  context('Basics',basics.bind(null,getTitle('Invoice'),'Invoice 2018.1',false))
  context('Features',()=>{
    elementLanguage()
    elementInvoice()
  })
})

describe('Reminder page',()=>{
  beforeEach(toPage.bind(null,'/client/22/1/reminder/1'))
  context('Basics',basics.bind(null,getTitle('Invoice'),'Invoice 2018.1',false))
  context('Features',()=>{
    elementLanguage()
    elementInvoice()
  })
})

describe('Quotation page',()=>{
  beforeEach(toPage.bind(null,'/client/22/1/quotation'))
  context('Basics',basics.bind(null,getTitle('Invoice'),'Invoice 2018.1',false))
  context('Features',()=>{
    elementLanguage()
    elementInvoice()
  })
})

describe('Settings page',()=>{
  beforeEach(toPage.bind(null,'/settings'))
  context('Basics',basics.bind(null,getTitle('Settings'),'Settings',true))
})

describe('Layout page',()=>{
  beforeEach(toPage.bind(null,'/layout'))
  context('Basics',basics.bind(null,getTitle('Layout'),'Layout',true))
  context('Features',()=>{
    elementLanguage()
    elementInvoice()
  })
})

describe('Data page',()=>{
  beforeEach(toPage.bind(null,'/data'))
  context('Basics',basics.bind(null,getTitle('Ddata'),'Data',true))
})

describe('Copy page',()=>{
  beforeEach(toPage.bind(null,'/copy'))
  context('Basics',basics.bind(null,getTitle('Copy'),'Copy',true))
  context('Features',()=>{
    elementLanguage()
  })
})

describe('About',()=>{
  beforeEach(toPage.bind(null,'/about'))
  context('Basics',basics.bind(null,getTitle('About'),'Project Invoice',false))
})