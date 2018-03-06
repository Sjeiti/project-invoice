import {
  toPage
  ,basics
  ,getTitle
  ,elementLanguage
  ,elementInvoice
} from './pi'

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