import React, {forwardRef, useEffect, useState} from 'react'
import styled from 'styled-components'
import QrScanner from 'qr-scanner'

const Element = styled.div`
  position: relative;
  width: 400px;
  max-width: 100%;
  height: 300px;
  margin: 1rem 0;
  video {
    width: 100%;
    height: 100%;
    background-color: #666;
    box-shadow: 0 0 5rem black inset, 0 0 0 1px black;
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
  <style type="text/css">* { fill: transparent; stroke: rgba(0,255,0,0.4); stroke-width: 8px; }</style>
  <rect x="64" y="64" width="128" height="128" mask="url(#hoe)" stroke="lime" stroke-width="8px" />
</svg>`)}');
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

function createScanner(video, setID){
  let scanned = false
  const qr = new QrScanner(video, result => {
    if (!scanned) {
      setID(result)
      scanned = true
    }
  })
  qr.start()
  return qr
}

function stopTracks(stream){
	stream&&stream.getTracks().forEach(track => track.stop())
}

export const VideoQR = forwardRef((props, ref) => {
  const setID = props.setID||(()=>{})
  const [stream, setStream] = useState(null)

  useEffect(()=>{
    const video = ref.current
    setVideoStream(video, setStream)
    const qr = createScanner(video, setID)
    return ()=>qr.destroy()
  }, [])

  useEffect(()=>()=>stopTracks(stream), [stream])

  return <Element {...props}><video ref={ref} /></Element>
})
