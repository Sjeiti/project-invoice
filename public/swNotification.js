/* eslint-disable require-jsdoc */

// Activate worker immediately
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()))
// // Become available to all pages
// self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()))

self.addEventListener('notificationclick',onNotificationClick)
self.addEventListener('message',onMessage)
self.addEventListener('notificationclose',onNotificationCLose)

/*setInterval(()=>{
  doMessage({id:'a',type:'message',delay:3000,title:'Twenty',body:'seconds interval'})
},20000)*/

const messages = []
const messagesMap = {}
let log = false

///////////////////////////////////////////////

function onMessage(event){
  const {data} = event
  const {type} = data
  log = !!data.log
  log&&console.log('onMessage',{event})
  //
  const sender = ( event.ports && event.ports[0] ) || event.source
  sender.postMessage('wait for ' + type)
  //
  type==='message'&&doMessage(data)
  ||type==='unmessage'&&unMessage(data)
}

function onNotificationClick(event){
  console.log('onNotificationClick',{event})
  const {notification} = event
  notification.data&&notification.data.uri&&openOrFocusPage(event)
  event.notification.close()
}

function onNotificationCLose(event){
  console.log('onNotificationCLose',{event})
  event.waitUntil(Promise.resolve())
}

///////////////////////////////////////////////

function doMessage(message){
  const {id,type,delay} = message
  log&&console.log('doMessage',{id,type,delay}) // todo: remove log
  if (messagesMap.hasOwnProperty(id)){
    log&&console.log('\toverwriting',id) // todo: remove log
    unMessage({id})
  }
  const fn = ()=>{
    const {timeoutId} = fn
    delete messagesMap[id]
    const {length} = arrayRemove(messages,timeoutId)
    messageOrNotification(Object.assign({},message,{length}))
  }
  messages.push(messagesMap[id] = fn.timeoutId = setTimeout(fn,delay||0))
}

function unMessage({id}){
  const timeoutId = messagesMap[id]
  delete messagesMap[id]
  arrayRemove(messages,timeoutId)
  clearTimeout(timeoutId)
}

function openOrFocusPage(event){
  const {uri} = event.notification.data
  const p = clients.matchAll({
    type: 'window'
    ,includeUncontrolled: true
  })
      .then(clients=>clients.pop())
      .then(client=>{
        if (client){
          client.focus()
          client.url!==uri&&client.postMessage({type:'navigate',uri})
        } else {
          clients.openWindow(uri)
        }
      })
  event.waitUntil(p)
}

////////////////////////////////////////////////////////////////////

function getFocussedClient(){
  return clients.matchAll({
    type: 'window'
    ,includeUncontrolled: true
  })
    .then(windowClients=>windowClients.filter(client=>client.focused).pop())
}

function messageOrNotification(message){
  getFocussedClient()
      .then(client=>{
        if (client){
          client.postMessage(message)
        } else {
          // const {title,body,uri,badge,icon} = message
          const {title} = message
          message.uri&&(message.data = {uri:message.uri})
          self.registration.showNotification(title,message)
          // self.registration.showNotification(title,{body,data: {uri},badge,icon})
        }
      })
}

function arrayRemove(array,element){
  const index = array.indexOf(element)
  index !== -1 && array.splice(index,1)
  return array
}