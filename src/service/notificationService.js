/* eslint-disable require-jsdoc */

import {message as sgMessage} from '../util/signal'
import model from '../model'

// const serviceWorkerUri = '/static/js/swNotification.js'
const serviceWorkerUri = '/swNotification.js'
  /** {boolean} */
const hasServiceWorker = 'serviceWorker' in navigator
  /** {boolean} */
const hasPushManager = 'PushManager' in window
  /** {ServiceWorkerContainer} */
let serviceWorker
  /** {ServiceWorkerRegistration} */
let registration
let notificationsEnabled = model.config.notifications // todo ... get from somewhere
console.log('notificationsEnabled',notificationsEnabled) // todo: remove log

// request permission if possible
if (hasServiceWorker&&hasPushManager){
  serviceWorker = navigator.serviceWorker
  notificationsEnabled&&requestAndEnable()
}

function requestAndEnable(){
  return requestPermission().then(disenable,disenable)
}

function requestPermission(){
  console.log('requestPermission') // todo: remove log
  return new Promise((resolve,reject)=>{
    Notification.requestPermission(result=>result==='granted'?resolve(true):reject(false))
  })
}

function disenable(enable = true){
  console.log('disenable',enable) // todo: remove log
  const eventMethod = (enable?serviceWorker.addEventListener:serviceWorker.removeEventListener).bind(serviceWorker)
  eventMethod('message',onMessage)
  // serviceWorker.addEventListener('message',console.log.bind(console,'mzg'))
  return (enable?registerServiceWorker():unRegisterServiceWorker())
        .then(reg=>{
          registration = reg
          notificationsEnabled = !!(enable&&reg)
          return reg
        })
}

function registerServiceWorker(){
  console.log('registerServiceWorker') // todo: remove log
  return serviceWorker.register(serviceWorkerUri)
    .then(registration=>{
      console.log('Service worker registered',{registration,serviceWorker}
        ,'\n\tserviceWorker.controller',serviceWorker.controller
        ,'\n\tnotificationsEnabled',notificationsEnabled
      )
      return registration
    },console.warn.bind(console,'Unable to register service worker.'))
}

function unRegisterServiceWorker(){
  return (registration&&Promise.resolve(registration)||serviceWorker.getRegistration('pi'))
    .then(registration => {
      registration&&registration.unregister().then(console.log.bind(console,'Service worker unregistered'))
    })
}

function onMessage(event){ // :NotificationEvent
  console.log('onMessage:\n\t Received a message from service worker: ',{event}
    ,'\n\ttitle',event.data.title
    ,'\n\tbody',event.data.body
  )
  const {data} = event
  const {type} = data
  type==='navigate'&&router.navigateByUrl(data.uri.replace(location.origin,''))
  ||type==='message'&&sgMessage.dispatch(data)
}

function message(msg){
  // console.log('message',msg) // todo: remove log
  return postMessage(Object.assign({},{
    type: 'message'
    ,delay: 3000
  },msg))
}

function unmessage(message){
  return postMessage(Object.assign({},{type: 'unmessage'},message))
}

function postMessage(message){
  return new Promise(function(resolve,reject){
    console.log('postMessage',{message,serviceWorker,registration}) // todo: remove log
    const messageChannel = new MessageChannel()
    messageChannel.port1.onmessage = e=>(e.data.error&&reject(e.data.error))||resolve(e.data)
    serviceWorker.controller&&serviceWorker.controller.postMessage(message,[messageChannel.port2])||console.warn('No serviceWorker.controller')
    registration.active.postMessage(message,[messageChannel.port2])
  })
}

//
/*notification(project:Project, addremove:boolean){
  if (addremove) {
    if (!project.paid) {
      message({
        id: 'notification'+project.id,
        title: 'Payment due',
        body: `Payment for invoice ${project.invoiceNr} to ${project.client.name} is due in ${project.dateLatest} ${Date.now()}`,
        uri: location.origin+project.uri
      })
    } else {
      console.log('project paid') // todo: remove log
    }
  } else {
    unmessage({id: 'notification'+project.id})
  }
}*/

export default {
  requestAndEnable
  ,disenable
  ,message
  ,unmessage
  ,postMessage
}