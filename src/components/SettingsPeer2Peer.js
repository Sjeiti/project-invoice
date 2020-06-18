import React,{createRef,useState,useEffect} from 'react'
import styled from 'styled-components'
import {Button} from './Button'
import {T} from '../components/T'
import {status as peerStatus, init as initPeer} from '../service/peer2peer'
import {InputText} from './Input'
import QrScanner from 'qr-scanner'

console.log('QrScanner', QrScanner) // todo: remove log

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
const Video = styled.video`
  width: 400px;
  height: 300px;
  box-shadow: 0 0 0 1px blue;
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

  const videoRef = createRef()

  useEffect(()=>{
    const video = videoRef.current
    ////////////////////////////
    // const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
    // if (getUserMedia) {
    //     getUserMedia({audio:false, video:true}, stream=>{
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio:false, video:true}, stream=>{
          video.src = window.URL.createObjectURL(stream)
          video.play()
          console.log('video.src',video.src) // todo: remove log
        }, console.warn.bind(console, 'Camera fail'))
    } else {
        console.warn('getUserMedia() not supported')
    }
    new QrScanner(video, result => console.log('decoded qr code:', result))
    /////////////////////////////
    // const image = document.createElement('image')
    // QrScanner.scanImage(image)
    //   .then(result => console.log(result))
    //   .catch(error => console.log(error || 'No QR code found.'));
  }, [videoRef])

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
    <Video ref={videoRef}></Video>
    </>
}
