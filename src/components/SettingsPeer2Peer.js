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

const Wait = styled.span`
  margin: 0 1rem;
  &:before {
    content: '';
    animation: slashRotate 600ms linear infinite;
    font-family: "Source Code Pro", monospace;
  }
  @keyframes slashRotate {
    from { content: '/'; }
    33% {  content: '-'; }
    66% {  content: '\\\\'; }
    to {   content: '|'; }
  }
`

const AWAITING = Symbol('AWAITING')

export const SettingsPeer2Peer = ({state, restoreState}) => {

  const [id, setID] = useState('')
  const [status, setStatus] = useState(peerStatus.IDLE)
  const [sending, setSending] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const [peerr, setPeer] = useState()
  const cendeiving = sending||receiving
  const awaiting = status===AWAITING

  function peerSendIntent(){
    setID('')
    setSending(true)
  }
  function peerSend(){
    setStatus(AWAITING)
    receiving&&setReceiving(false)
    const peer = initPeer(id)
    peer.connected.add(()=>{
      peer.send(JSON.stringify(state))
      peer.received.add(peer.disconnect.bind(peer))
    })
    peer.statusChanged.add(onStatusChanged)
    peer.disconnected.add(peerCancel)
    setPeer(peer)
  }
  function peerReceive(){
    setID('')
    setReceiving(true)
    const peer = initPeer()
    peer.id.add(setID)
    peer.received.add(data=>{
      peer.send('thanks')
      restoreState(JSON.parse(data))
      peer.disconnect()
    })
    peer.statusChanged.add(onStatusChanged)
    peer.disconnected.add(peerCancel)
    setPeer(peer)
  }
  function peerCancel(){
    setReceiving(false)
    setSending(false)
    setStatus(peerStatus.IDLE)
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
  	setStatus(newStatus)
    newStatus===peerStatus.LOST&&peerCancel()
  }

  return <>
      {sending&&(
        awaiting
          &&<Wait />
          ||<><InputText value={id} setter={setID} data-cy="p2pInput" /><Button onClick={peerSend} data-cy="p2pSend"><T>send</T></Button></>
      )}
      {cendeiving||<>
        <Button onClick={peerSendIntent} data-cy="p2pSendIntent"><T>send</T></Button>
        <Button onClick={peerReceive} data-cy="p2pReceive"><T>receive</T></Button>
      </>}
      {receiving&&<Id>ID: {id||<Wait />}</Id>}
      {cendeiving&&<>
        <Button onClick={peerCancel} data-cy="p2pCancel"><T>cancel</T></Button>
        {/*<div>Status: {status}</div>*/}
      </>}
      {receiving&&<Explain><T>peer2peerExplainReceiverID</T></Explain>}
      {sending&&<Explain><T>peer2peerExplainSenderID</T></Explain>}
    </>
}