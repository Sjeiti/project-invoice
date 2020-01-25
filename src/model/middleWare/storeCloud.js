import {getStorage} from '../../service/localStorage'
import {CLOUD_NAME, STORAGE_NAME} from '../../config'
import {clouding, notify} from '../../util/signal'
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
      initCloud()
          .then(handleAuthoriseSuccess, handleAuthoriseFail)
          .then(authorised=>authorised&&storeInCloud())
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
  return true
}

function handleAuthoriseFail(){
  notify.dispatch('Cloud authorisation failed')
  return false
}

function storeInCloud(){
  console.log('storeInCloud') // todo: remove log
  const data = getStorage(STORAGE_NAME, false)
  clouding.dispatch(true)
  write(CLOUD_NAME, stringify(data))
      .then(()=>{},notify.dispatch.bind(notify, 'Cloud write fail'))
      .then(clouding.dispatch.bind(clouding, false))
}

export function cloudRead(cloudType){
  console.log('cloudRead',cloudType) // todo: remove log
  clouding.dispatch(true)
  setCloudType(cloudType)
  return (getIsAuthorised()
      ?read(CLOUD_NAME)
      :initCloud()
          .then(handleAuthoriseSuccess, handleAuthoriseFail)
          .then(authorised=>authorised&&read(CLOUD_NAME)))
      .then(response=>{
        clouding.dispatch(false)
        return response
      })
}