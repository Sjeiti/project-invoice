import Peer from 'peerjs'
import {signal} from '../util/signal'

let connection
let lastPeerId

// stati need to be sent so cannot be Symbols
export const status = {
  IDLE: 'IDLE'
  ,CONNECTED: 'CONNECTED'
  ,RESET: 'RESET' // Connection reset, awaiting connection...
  ,LOST: 'LOST' // Connection lost. Please reconnect
  ,DESTROYED: 'DESTROYED' // Connection destroyed. Please refresh
  ,ERROR: 'ERROR'
  ,CLOSED: 'CLOSED'
}

export function init(initID){

  const idState = signal()
  const statusChanged = signal()
  const connected = signal()
  const received = signal()
  const disconnected = signal()

  const peerId = Math.floor(Math.random()*1E16).toString(16)
  const peer = new Peer(peerId, { debug: 2 })
  const disconnect = peer.disconnect.bind(peer)

  peer.on('open', id => {
    // Workaround for peer.reconnect deleting previous id
    if (peer.id === null) {
      // console.log('Received null id from peer open')
      peer.id = lastPeerId
    } else {
      lastPeerId = peer.id
    }
    idState.dispatch(peer.id)
    initID&&connect(initID)
  })
  peer.on('connection', newConnection=>{
    if (connection) {
      newConnection.on('open', ()=>{
        newConnection.send('Already connected to another client')
        setTimeout(newConnection.close.bind(newConnection), 500)
      })
    } else {
      connection = newConnection
      setStatus(status.CONNECTED, connection.peer)
      connection.on('data', data=>{
        received.dispatch(data)
      })
      connection.on('close', ()=>{
        setStatus(status.RESET)
        connection = null
      })
    }
  })
  peer.on('disconnected', ()=>{
    setStatus(status.LOST)
    // peer.id = lastPeerId // Workaround for peer.reconnect deleting previous id
    // peer._lastServerId = lastPeerId
    // peer.reconnect()
    disconnected.dispatch()
  })
  peer.on('close', ()=>{
    connection = null
    setStatus(status.DESTROYED)
  })
  peer.on('error', err=>setStatus(status.ERROR, err))

  function connect(id){
    connection&&connection.close()
    connection = peer.connect(id, {reliable: true})
    connection.on('open', ()=>{
      setStatus(status.CONNECTED, connection.peer)
      connected.dispatch()
    })
    // conn.on('data', addMessage) // senders don't receive
    connection.on('close', setStatus.bind(null, status.CLOSED))
  }

  function send(data){
    if (connection && connection.open) {
      connection.send(data)
    } else {
      setStatus(status.CLOSED)
    }
  }

  function setStatus(...msg){
    console.log('setStatus', msg) // todo: remove log
    statusChanged.dispatch(...msg)
  }

  return {
    id: idState
    ,statusChanged
    ,connected
    ,send
    ,received
    ,disconnect
    ,disconnected
  }
}