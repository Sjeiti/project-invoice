import {getStorage} from '../../service/localStorage'
import {STORAGE_NAME} from '../../config'
import {clouding,notify} from '../../util/signal'
import {stringify} from '../../service/json'
import {
  ID as idDrive
  , init as initDrive
  , getAuthorised as getAuthorisedDrive
  , read as readDrive
  , write as writeDrive
} from '../../service/cloudDrive'

let initCloud, getIsAuthorised, read, write

export const storeCloud = store => next => action => {
  const result = next(action)
  const state = store.getState()
  const {config:{cloudSelected}} = state
  if (cloudSelected) {
    setCloudType(cloudSelected)
    if (!getIsAuthorised()) {
      initCloud().then(handleAuthoriseSuccess, handleAuthoriseFail)
    } else {
      storeInCloud()
    }
  }
  return result
}

function setCloudType(type){
	// console.log('setCloudType', type) // todo: remove log
  if (type===idDrive) {
    initCloud = initDrive
    getIsAuthorised = getAuthorisedDrive
    read = readDrive
    write = writeDrive
  } else {
    // console.log(`Clould type '${type}' not recognised.`) // todo: remove log
    notify.dispatch(`Clould type '${type}' not recognised.`)
  }
}

function handleAuthoriseSuccess(){
  // console.log('handleAuthoriseSuccess') // todo: remove log
  storeInCloud()
}

function handleAuthoriseFail(){
  // console.log('handleAuthoriseFail') // todo: remove log
}

function storeInCloud(){
  const data = getStorage(STORAGE_NAME, false)
  // console.log('storeInCloud') // todo: remove log
  clouding.dispatch(true)
  write('nl.projectinvoice.data.test', stringify(data))
      .then(()=>{}) // todo write success/fail
      // .then(console.log.bind(console, 'gdrive write done')) // todo write success/fail
      .then(clouding.dispatch.bind(clouding, false))
}