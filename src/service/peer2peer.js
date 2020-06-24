import Peer from 'peerjs'
import {signal} from '../util/signal'
import {MODE_DEVELOPMENT, PEER_HOST, PEER_STUN, STORAGE_NAME, VERSION} from '../config'

let connection
let lastPeerId

const peerConfig = {
  debug: MODE_DEVELOPMENT?3:0
  , config: {iceServers: [{ urls: PEER_STUN }]}
  , host: PEER_HOST
}

// stati need to be sent so cannot be Symbols
export const status = {
  IDLE: 'IDLE'
  , CONNECTED: 'CONNECTED'
  , RESET: 'RESET' // Connection reset, awaiting connection...
  , LOST: 'LOST' // Connection lost. Please reconnect
  , DESTROYED: 'DESTROYED' // Connection destroyed. Please refresh
  , ERROR: 'ERROR'
  , CLOSED: 'CLOSED'
}

export function init(initID){

  const idState = signal()
  const statusChanged = signal()
  const connected = signal()
  const received = signal()
  const disconnected = signal()

  const peerId = getRandomPeerID()
  const peer = new Peer(peerId, peerConfig)
  const disconnect = peer.disconnect.bind(peer)

  peer.on('open', () => {
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
      connection.on('data', received.dispatch.bind(received))
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
  peer.on('error', err=>{
    setStatus(status.ERROR, err)
    console.warn('Peer error', err)
  })

  function connect(id){
    connection&&connection.close()
    connection = peer.connect(id, {reliable: true})
    connection.on('open', ()=>{
      setStatus(status.CONNECTED, connection.peer)
      connected.dispatch()
    })
    // connection.on('data', console.log.bind(console,'sender received')) // senders don't receive
    connection.on('data', received.dispatch.bind(received))
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
    statusChanged.dispatch(...msg)
  }

  return {
    id: idState
    , statusChanged
    , connected
    , send
    , received
    , disconnect
    , disconnected
  }
}

function getRandomPeerID(){
	return btoa(STORAGE_NAME+VERSION).split('').reverse().join('').substr(2).toLowerCase()+Math.floor(Math.random()*1E16).toString(16)
}
