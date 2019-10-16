const faker = require('faker')
const moment = require('moment')
const utils = require('./util/utils')
const {save} = utils

const numClients = 33
const numProjects = numClients*7
const years = 5

const defaultJSON = require('../src/model/defaultJSON')

const {version} = require('../package')

faker.seed(800)

const now = Date.now()
const day = 1000*60*60*24
const week = day*7
// const month = day*30
const year = day*365
const dateString = millis=>moment(new Date(millis)).format('YYYY-MM-DD')

let projectIndex = 0

const clients = []
for (let i=0;i<numClients;i++) {
  const clientNr = i+1
  const projects = []
  for (let j = 0, l = Math.round(Math.random() * numProjects / numClients); j<l; j++) {
    let k, m;
    projectIndex++
    const projectDate = now - Math.round(Math.random()*years*year)
    const lines = []
    for (k=0, m=(1+7*Math.random())<<0;k<m;k++) {
      const hours = 2 + Math.random()*Math.random()*55<<0
    	lines.push({
        description: faker.commerce.department()
        , hours
        , vat: 21
        , amount: hours*60
      })
    }
    const invoices = []
    for (k = 0, m = lines.length?Math.round(0.1 + 5 * Math.random()):0; k<m; k++) {
    	invoices.push({
        date: dateString(projectDate + k*week)
        , type: k===0?'invoice':'reminder'
        , interest: false
      })
    }
  	projects.push({
      id: projectIndex
      , clientNr
      , description: faker.commerce.productName()
      , hourlyRate: 0
      , discount: 0
      , lines
      , invoices
      , paid: invoices.length===0?false:Math.random()*(1-(now-projectDate)/(years*year))<0.7
      , quotationDate: ''
      , quotationStartDate: ''
      , quotationDuration: ''
      , quotationBefore: ''
      , quotationAfter: ''
    })
  }
	clients.push({
    nr: clientNr
    , name: faker.company.companyName()
    , address: faker.address.streetAddress()
    , zipcode: faker.address.zipCode()
    , postbox: ''
    , zippost: ''
    , city: faker.address.city()
    , phone: ''
    , paymentterm: '21'
    , contact: faker.name.findName()
    , projects
  })
}


const data = {...defaultJSON, ...{
  pi: {
    timestamp: now
    , version
  }
  , clients
}}

save(`./temp/dataTemp_${(new Date).toISOString().replace(/:\w+\.\w+$/,'').replace(/:/g,'-')}.json`, JSON.stringify(data))