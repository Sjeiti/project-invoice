// import local from './storageLocal'
import drive from './storageDrive'
import {storageInitialised,sync,notify} from '../util/signal'
// import {notify} from '../components/Notification'

const providers = {drive}
const syncOn = sync.dispatch.bind(sync,true)
const syncOff = sync.dispatch.bind(sync,false)
let provider

/**
 * Initialise the storage
 * @param {string} providerKey
 */
function init(providerKey){
  if (providers.hasOwnProperty(providerKey)){
    setTimeout(syncOn)
    provider = providers[providerKey]
    provider.init()
        .then(initSuccess,initFailed)
        .then(syncOff)
  }
}

/**
 * Init success handler
 */
function initSuccess(){
  storageInitialised.dispatch(true)
}

/**
 * Init fail handler
 */
function initFailed(){
  storageInitialised.dispatch(false)
  notify.dispatch(`Authentication for ${provider.name} failed. Go to settings to authorise.`)
  // notify(`Authentication for ${provider.name} failed. Go to settings to authorise.`)
}

/**
 * Read a file through the provider
 * @param {string} file
 * @returns {Promise}
 */
function read(file){
  let promise
  if (provider){
    syncOn()
    promise = provider
        .read(file)
        .then(result=>(syncOff(),result))
  }
  return promise
}

/**
 * Write a file through the provider
 * @param {string} file
 * @param {object} data
 * @returns {Promise}
 */
function write(file,data){
  let promise
  if (provider){
    syncOn()
    promise = provider
        .write(file,data)
        .then(result=>(syncOff(),result))
  }
  return promise
}

/**
 * Revoke provider access
 */
function revoke(){
  syncOff()
  provider = null
}

export default {
  providers
  ,init
  ,get authorised(){
 return provider&&provider.authorised||false
}
  ,read
  ,write
  ,revoke
}