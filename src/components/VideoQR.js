import React, {forwardRef, useEffect, useState} from 'react'
import styled from 'styled-components'
import QrScanner from 'qr-scanner'
import {notify} from '../util/signal'
import {ERROR} from './Notification'
import {useTranslation} from 'react-i18next'

const Element = styled.div`
  position: relative;
  width: 300px;
  max-width: 100%;
  height: 300px;
  overflow: hidden;
  margin: 1rem 0;
  video {
    width: 100%;
    height: 100%;
    margin: 50% 0 0 50%;
    transform: translate(-50%, -50%);
    background-color: #666;
    box-shadow: 0 0 5rem black inset, 0 0 0 1px black;
    &.qr-scanner {
      transform: translate(-50%, -50%) scaleX(1);
      &--mirror { transform: translate(-50%, -50%) scaleX(-1); }
    }
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    background-size: cover;
    background-position: center center;
    background-image: url('data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <style type="text/css">
    * { fill: transparent; stroke: rgba(55,201,255,0.6); stroke-width: 8px; overflow: visible; }
    line { stroke-width: 2px; }
    path { stroke-width: 58px; stroke: rgba(55,201,255,0.4); }
  </style>
  <svg x="128" y="128">
    <rect x="-96" y="-96" width="192" height="192" />
  </svg>
  <line x1="50%" y1="0" x2="50%" y2="100%" />
  <line x1="0" y1="50%" x2="100%" y2="50%" />
  <path d="M0 0 L256 0 L256 256 L0 256 L0 0"/>
</svg>`)}');
    box-shadow: 0 0 0 2px black inset;
  }
`

async function setVideoStream(video, setStream){
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter(({kind})=>kind==='videoinput')
  const backVideo = videoDevices.filter(({label})=>label.includes('back')).pop()
  const constraints = { video: backVideo&&{ deviceId: { exact: backVideo.deviceId }}||true}
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  video.srcObject = stream
  video.play()
  setStream(stream)
}

function createScanner(video, setID, t){
  let scanned = false
  const qr = new QrScanner(video, result => {
    if (!scanned) {
      setID(result)
      scanned = true
    }
  })
  qr.start().catch(err => {
    const message = err==='Camera not found.'?t('peer2peerErrorCamera'):err
	  notify.dispatch({message, type: ERROR})
  })
  return qr
}

function centerVideo(video){
  video.addEventListener('loadedmetadata', ()=>{
    const ar = video.videoWidth/video.videoHeight
    if (ar>1) video.style.width = `${100*ar}%`
    else video.style.height = `${100*(1/ar)}%`
  })
}

function stopTracks(stream){
	stream&&stream.getTracks().forEach(track => track.stop())
}

export const VideoQR = forwardRef((props, ref) => {
  const setID = props.setID||(()=>{})
  const [stream, setStream] = useState(null)
  const {t} = useTranslation()

  useEffect(()=>{
    const video = ref.current
    setVideoStream(video, setStream)
    const qr = createScanner(video, setID, t)
    centerVideo(video)
    return ()=>qr.destroy()
  }, [])

  useEffect(()=>()=>stopTracks(stream), [stream])

  return <Element {...props}><video ref={ref} /></Element>
})
