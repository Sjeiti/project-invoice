// import Signal from 'signals'
// import util from './util'
import projectSort from '../util/projectSort'

import defaultConfig from '../data/config'
import defaultData from '../data/data'

import { create as createClient } from './client'
import { create as createCopy } from './copy'
import { modelSaved } from '@/formState'

const config = getStored('config',defaultConfig)
const data = getStored('data',defaultData)

const model = {
  clients: data.clients
  ,config: {}
  ,copy: {}
  ,personal: {}
  ,getClientByNr(nr){
    return this.clients.filter(client=>client.nr===nr).pop()
  }
  ,addClient(){
    const clientNr = Math.max(...this.clients.map(o=>o.nr)) + 1
    const client = createClient({
      name: `new client ${clientNr}`
      ,nr: clientNr
      ,projects: []
    }, this)
    this.clients.push(client)
    setStored('data', data)
    return client
  }
  ,deleteClient(client){
    const index = this.clients.indexOf(client)
    const valid = index!==-1
    valid&&this.clients.splice(index,1)
    return valid
  }
}

modelSaved.add(()=>{
  setStored('data', data)
})

Object.setPrototypeOf(model,{
  get projects() {
    projectSort
    return this.clients
        .map(client => client.projects)
        .reduce((projects,project) => (projects.push(...project), projects),[])
        .sort(projectSort)
  }
});

model.clients.forEach(client=>createClient(client, model))
for (let key in data.copy) {
    model.copy[key] = createCopy(data.copy[key])
}
Object.assign(model.personal, data.personal)
Object.assign(model.config, config)

function getStored(name, defaultsTo){
  const rawData = localStorage.getItem(name)
  let data;
  try {
    data = rawData&&JSON.parse(rawData)
  } catch(err){}
	return rawData&&data||defaultsTo
}

function setStored(name, data){
  let stringData;
  try {
    stringData = JSON.stringify(data)
  } catch(err){}
	return localStorage.setItem(name,stringData)
}

export default model
