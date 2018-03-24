import projectSort from '../util/projectSort'
import {tryParse,tryStringify} from '../util'
import {storageInitialised,modelReplaced} from '../util/signal'
import storageService from '../service/storage'
import defaultData from '../data/data'
import {VERSION} from '../config'

import { create as createClient } from './client'
import { create as createCopy } from './copy'
import { create as createConfig } from './config'
import { create as createCloneable } from './cloneable'
import { modelSaved } from '../formState'

const ns = location.host.replace(/^localhost.*/,'local.projectinvoice.nl').split(/\./g).reverse().join('.')
const fileName = `${ns}.data.json`

const data = getStored('data',defaultData)

// config removal: 2.1.22 -> 2.2
const oldConfig = getStored('config')
if (oldConfig){
  data.config = oldConfig
  delete localStorage.config
  setStored('data',data)
}

// cloud checking
storageService.init(data.config.cloudSelected)
storageInitialised.add(success=>{
  success&&storageService
      .read(fileName)
      .then(
          json=>{ // file read
            if (json){ // can fail
              const parsed = JSON.parse(json)
            /*console.log('firstRead'
                ,'\n\tserver',parsed.timestamp
                ,'\n\tlocall',data.timestamp
                ,parsed.timestamp>data.timestamp,{parsed}); // todo: remove log*/
            if (parsed.timestamp>data.timestamp){
                model.data = parsed
                modelReplaced.dispatch(model.data)
              }
            }
          }
          ,()=>{ // file not found
            // console.log('file not found',nameData); // todo: remove log
            let stringData = tryStringify(data)
            storageService
                .write(fileName,stringData)
                .then(console.log.bind(console,'write success'))
          }
      )
})

// create model
const model = Object.create({
  get data(){
 return data
}
  ,set data(newData){
    this.setData(newData)
    setStored('data',data)
  }
  ,get config(){
 return data.config
}
  ,get clients(){
 return this.data.clients
}
  ,get copy(){
 return this.data.copy
}
  ,get personal(){
 return this.data.personal
}
  ,get projects(){
    return this.clients
        .map(client => client.projects)
        .reduce((projects,project)=>(projects.push(...project),projects),[])
        .sort(projectSort)
  }
  ,getClientByNr(nr){
    return this.clients.filter(client=>client.nr===nr).pop()
  }
  ,addClient(){
    const clientNr = Math.max(...this.clients.map(o=>o.nr)) + 1
    const client = createClient({
      name: `new client ${clientNr}`
      ,nr: clientNr
      ,projects: []
    },this)
    this.clients.push(client)
    setStored('data',data)
    return client
  }
  ,deleteClient(client){
    const index = this.clients.indexOf(client)
    const valid = index!==-1
    valid&&this.clients.splice(index,1)
    return valid
  }
  ,setData(newData){
    Object.assign(data,newData||defaultData)
    data.config = createConfig(data.config)
    data.clients.forEach(client=>createClient(client,model))
    data.copy = Object.assign({},defaultData.copy,data.copy) // make sure required copy exists
    for (let key in data.copy){
      model.copy[key] = createCopy(data.copy[key],data.config)
    }
    Object.assign(model.personal,data.personal)
    createCloneable(data.copy)
    createCloneable(data.personal)
  }
})

export default model

model.setData(data) // no save

modelSaved.add(()=>{
  setStored('data',data)
})

/**
 * Get localStorage JSON with fallback
 * @param {string} name
 * @param {object} defaultsTo
 * @returns {object}
 */
function getStored(name,defaultsTo){
  const rawData = localStorage.getItem(name)
  let data = tryParse(rawData)
  return rawData&&data||defaultsTo
}

/**
 * Set localStorage JSON
 * And possibly save cloud
 * @param {string} name
 * @param {object} data
 */
function setStored(name,data){
  data.timestamp = Date.now()
  data.version = VERSION
  let stringData = tryStringify(data)
  //
  storageService.authorised&&storageService.write(fileName,stringData)
  //
  localStorage.setItem(name,stringData)
}