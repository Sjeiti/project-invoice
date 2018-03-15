import local from './storageLocal'
import drive from './storageDrive'
import {notify,storageInitialised,sync} from '../util/signal'

const providers = {local, drive}
const syncOn = sync.dispatch.bind(sync,true)
const syncOff = sync.dispatch.bind(sync,false)
let provider

function init(providerKey){
  console.log('init',providerKey); // todo: remove log
  if (providers.hasOwnProperty(providerKey)) {
    setTimeout(syncOn)
    provider = providers[providerKey]
    provider.init()
        .then(initSuccess,initFailed)
        .then(syncOff)
  }
}

function initSuccess(){
  storageInitialised.dispatch(true)
	console.log('Storage initialised'); // todo: remove log
}

function initFailed(){
  storageInitialised.dispatch(false)
  notify.dispatch(`Authentication for ${provider.name} failed. Go to settings to authorise.`)
}

function read(file){
	let promise
  if (provider) {
	  syncOn()
    promise = provider.read(file).then(result=>(syncOff(),result))
  }
  return promise
}

function write(file,data){
	let promise
  if (provider) {
	  syncOn()
    promise = provider.write(file,data).then(result=>(syncOff(),result))
  }
  return promise
}

export default {
  providers
  ,init
  ,get authorised() { return provider&&provider.authorised||false }
  ,read
  ,write
}