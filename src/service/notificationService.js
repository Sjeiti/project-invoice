/* eslint-disable require-jsdoc */

import {storageFinalised,message as sgMessage} from '../util/signal'
import {appMessage} from '../util/serviceWorker'
import router from '../router'
import {promiseSignal,promiseTimeout} from '../util'
import model from '../model'

/** {ServiceWorkerContainer} */
const {serviceWorker} = navigator
/** {ServiceWorkerRegistration} */
let registration
/** {boolean} */
const isProduction = process.env.NODE_ENV==='production'
// let notificationsEnabled = model.config.notifications // todo ... get from somewhere
// console.log('notificationsEnabled',notificationsEnabled) // todo: remove log

appMessage.add(onMessage)
serviceWorker.addEventListener('message',onMessage)

serviceWorker.ready.then(_registration=>{
  registration = _registration
})

Promise.all([
    serviceWorker.ready
    ,Promise.race([
        promiseSignal(storageFinalised)
        ,promiseTimeout(5000)
    ]).then(promiseTimeout.bind())
])
.then(onFiveSecondsElapsed)
// setTimeout(onFiveSecondsElapsed,5000)
// modelReplaced

/**
 * Request Notification permission wrapped in a Promise
 * @returns {Promise<any>}
 */
function requestPermission(){
  console.log('requestPermission') // todo: remove log
  return new Promise((resolve,reject)=>{
    Notification.requestPermission(result=>result==='granted'?resolve(true):reject(false))
  })
}

/**
 * The Data has been parsed
 */
function onFiveSecondsElapsed(){
  console.log('onFiveSecondsElapsed') // todo: remove log
  // console.log('model.projects.daysLate',model.projects.map(p=>p.isLate)) // todo: remove log
  model.projects.filter(project=>
      !project.paid
      &&!project.isLate
      &&project.invoices.length>0
      &&!project.notified
  ).forEach(project=>{
    const {client,invoices:[invoice]} = project
    const delay = (client.paymentterm - project.daysLate)*1000*60*60*24
    console.log('\tproject.description',project.description,client.paymentterm - project.daysLate) // todo: remove log
    message({
      id: project.id
      ,title: `Client '${client.name}' due for payment`
      ,body: `Project '${project.description}' was invoiced on ${invoice.date}`
      ,uri: location.origin+project.uri
      ,actions: [
          {
            action: 'view'
            ,title: 'view'
          }
       ]
      ,delay
    })
  })
}

/**
 * Message handler for notification
 * @param {NotificationEvent} event
 */
function onMessage(event){
  console.log('onMessage:\n\tReceived a message from service worker: ',{event}
    ,'\n\ttitle',event.data.title
    ,'\n\tbody',event.data.body
    ,'\n\ttype',event.data.type
  ) // todo: remove log
  const {data} = event
  const {type} = data
  type==='navigate'&&router.push(data.uri.replace(location.origin,''))
  ||type==='message'&&sgMessage.dispatch(data)
}

/**
 * Send a message
 * @param {object} msg
 * @returns {Promise<any>}
 */
function message(msg){
  console.log('message',msg) // todo: remove log
  return postMessage(Object.assign({},{
    type: 'message'
    ,badge: location.origin+'/static/img/icon-128x128.png'
    ,icon: location.origin+'/static/img/icon-192x192.png'
    ,delay: 3000
    ,log: !isProduction
  },msg))
}

/**
 * Unmessage
 * @param {object} message
 * @returns {Promise<any>}
 */
function unmessage(message){
  return postMessage(Object.assign({},{type: 'unmessage'},message))
}

/**
 * Promise wrapped notification message
 * @param {object} message
 * @returns {Promise<any>}
 */
function postMessage(message){
  return new Promise(function(resolve,reject){
    console.log('postMessage',{message,serviceWorker,registration}) // todo: remove log
    //
    const messageChannel = new MessageChannel()
    messageChannel.port1.onmessage = e=>(e.data.error&&reject(e.data.error))||resolve(e.data)
    //
    // const {controller} = serviceWorker
    // if (controller) controller.postMessage(message,[messageChannel.port2])
    // else console.warn('No serviceWorker.controller',serviceWorker)
    //
    const serviceWorker = registration.install||registration.waiting||registration.active
    serviceWorker.postMessage(message,[messageChannel.port2])
    //
    // registration.active.postMessage(message,[messageChannel.port2])
  })
}

export default {
  message
  ,unmessage
  ,postMessage
  ,requestPermission
}