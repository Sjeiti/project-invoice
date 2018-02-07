// import Signal from 'signals'
// import util from './util'
import projectSort from '../util/projectSort'

import config from '../data/config'
import data from '../data/data'

import { create as createClient } from './client'
import { create as createCopy } from './copy'

const model = {
    clients: []
    ,config: {}
    ,copy: {}
    ,personal: {}
    ,getClientByNr(nr){
        return this.clients.filter(client=>client.nr===nr).pop()
    }
}

Object.setPrototypeOf(model, {
    get projects(){
        projectSort
        return this.clients
            .map(client => client.projects)
            .reduce((projects,project) => (projects.push(...project), projects),[])
            .sort(projectSort)
    }
});

model.clients.push(...data.clients.map(client=>createClient(client, model)))
for (let key in data.copy) {
    model.copy[key] = createCopy(data.copy[key])
}
Object.assign(model.personal, data.personal)
Object.assign(model.config,config)

export default model
