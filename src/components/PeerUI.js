import React, {useState} from 'react'
import styled from 'styled-components'
import {Button} from './Button'
import {T} from '../components/T'
import {status as peerStatus, init as initPeer} from '../service/peer2peer'
import {InputText} from './Input'

const Id = styled.span`
  position: relative;
  display: inline-block;
  margin: 0;
  padding: 0 1rem 0 0;
  line-height: 1.875rem;
`
const Explain = styled.div`
  font-weight: bold;
`

export const PeerUI = ({data, restore}) => {

  const [id, setID] = useState('')
  const [status, setStatus] = useState(peerStatus.IDLE)
  const [sending, setSending] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const [peerr, setPeer] = useState()
  const cendeiving = sending||receiving

  function peerSendIntent(){
    setSending(!sending)
    receiving&&setReceiving(false)
  }
  function peerSend(){
    setSending(!sending)
    receiving&&setReceiving(false)
    const peer = initPeer(id)
    peer.connected.add(()=>{
      peer.send(data)
      peer.disconnect()
    })
    peer.statusChanged.add(onStatusChanged)
    peer.disconnected.add(peerCancel)
    setPeer(peer)
  }
  function peerReceive(){
    setReceiving(!receiving)
    sending&&setSending(false)
    const peer = initPeer()
    peer.id.add(setID)
    peer.statusChanged.add(onStatusChanged)
    peer.received.add(data=>{
      restore(JSON.parse(data)) // todo: validate data (also check onChangeRestore on Settings.js)
      peer.disconnect()
    })
    peer.disconnected.add(peerCancel)
    setPeer(peer)
  }
  function peerCancel(){
    receiving&&setReceiving(false)
    sending&&setSending(false)
    sending&&setStatus(peerStatus.IDLE)
    if (peerr) {
      peerr.id.removeAll()
      peerr.statusChanged.removeAll()
      peerr.connected.removeAll()
      peerr.received.removeAll()
      peerr.disconnected.removeAll()
    }
  }
  function onStatusChanged(...states){
    const newStatus = states[0]
    //console.log('onStatusChanged',...states) // todo: remove log
  	setStatus(newStatus)
    newStatus===peerStatus.LOST&&peerCancel()
  }

  return <>
      {sending&&<><InputText value={id} setter={setID} /><Button onClick={peerSend}><T>send</T></Button></>}
      {cendeiving||<>
        <Button onClick={peerSendIntent}><T>send</T></Button>
        <Button onClick={peerReceive}><T>receive</T></Button>
      </>}
      {receiving&&<Id>ID: {id}</Id>}
      {cendeiving&&<>
        <Button onClick={peerCancel}><T>cancel</T></Button>
        {/*<div>Status: {status}</div>*/}
      </>}
      {receiving&&<Explain><T>peer2peerExplainReceiverID</T></Explain>}
      {sending&&<Explain><T>peer2peerExplainSenderID</T></Explain>}
    </>
}