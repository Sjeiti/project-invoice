import projectSort from '../util/projectSort'
import {weakAssign} from '../util'
import {storageInitialised, modelReplaced} from '../util/signal'
import storageService from '../service/storage'
import defaultConfig from '../data/config'
import defaultData from '../data/data'

import { create as createClient } from './client'
import { create as createCopy } from './copy'
import { create as createConfig } from './config'
import { create as createCloneable } from './cloneable'
import { modelSaved } from '../formState'

const config = getStored('config',defaultConfig)
const data = getStored('data',defaultData)

weakAssign(config,defaultConfig)

const nameData = 'projectInvoice.data.json'
const nameConfig = 'projectInvoice.config.json'

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

storageService.init(config.cloudSelected)
storageInitialised.add(success=>{
  console.log('storageInitialised'); // todo: remove
  success&&storageService
      .read(nameData)
      .then(
          json=>{ // file read
            const parsed = JSON.parse(json)
            console.log('read success',parsed); // todo: remove log
            console.log('\tnewer',parsed.timestamp>data.timestamp); // todo: remove log
            if (parsed.timestamp>data.timestamp) {
              model.data = parsed
              modelReplaced.dispatch(model.data)
              console.log('\tlocal replaced'); // todo: remove log
            }
          }
          ,()=>{ // file not found
            let stringData;
            try {
              stringData = JSON.stringify(data)
            } catch(err){}
            storageService
                .write(nameData,stringData)
                .then(console.log.bind(console,'write success'))
          }
      )
})

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


const model = {
  getClientByNr(nr){
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
  ,get projects(){
    return this.clients
        .map(client=>client.projects)
        .reduce((a,b)=>(a.push(...b),a),[])
  }
  ,get data(){
    return data
  }
  ,set data(newData){
    Object.assign(data, newData||defaultData)
    data.clients.forEach(client=>createClient(client, model))
    createCloneable(data.copy)
    createCloneable(data.personal)
    setStored('data', data)
  }
  ,get config(){
    return config
  }
  ,set config(newConfig){
    Object.assign(config, createConfig(newConfig||defaultConfig))
    setStored('config', config)
  }
  ,get clients(){ return this.data.clients }
  ,get copy(){ return this.data.copy }
  ,get personal(){ return this.data.personal }
}

model.config = config
model.data = data

modelSaved.add(()=>{
  setStored('data', data)
  setStored('config', config)
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

for (let key in data.copy) {
    model.copy[key] = createCopy(data.copy[key],model.config)
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
  //
  storageService.authorised&&storageService.write(name==='data'?nameData:nameConfig,stringData)
  //
	return localStorage.setItem(name,stringData)
}

export default model
