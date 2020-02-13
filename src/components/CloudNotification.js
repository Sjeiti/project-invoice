import React, { useEffect, useState } from 'react'
import styled, {css} from 'styled-components'
import {clouding, animate} from '../util/signal'

const Svg = styled.svg`

  --t: 500ms;

  fill: #888;
  margin: 0.25rem;
  transform: scale(0.9);
  transition: fill 200ms linear;
  ${props => props.playing===true && css`
    fill: #FFF;
  ` || css`
    g { animation-play-state: paused!important; }
  `}
  
  @keyframes vvv {
    0% { visibility: visible; }
    14.29% { visibility: visible; }
    14.29% { visibility: hidden; }
    100% { visibility: hidden; }
  }
  #c1 { animation: vvv var(--t) linear calc(1*var(--t)/7 - var(--t)) infinite; }
  #c2 { animation: vvv var(--t) linear calc(2*var(--t)/7 - var(--t)) infinite; }
  #c3 { animation: vvv var(--t) linear calc(3*var(--t)/7 - var(--t)) infinite; }
  #c4 { animation: vvv var(--t) linear calc(4*var(--t)/7 - var(--t)) infinite; }
  #c5 { animation: vvv var(--t) linear calc(5*var(--t)/7 - var(--t)) infinite; }
  #c6 { animation: vvv var(--t) linear calc(6*var(--t)/7 - var(--t)) infinite; }
  #c7 { animation: vvv var(--t) linear calc(7*var(--t)/7 - var(--t)) infinite; }
`

export const CloudNotification = ()=>{
  const [playing, setPlaying] = useState(false)
  const [frame, setFrame] = useState(1)
  //
  useEffect(()=>{
    let animating
    function anim(){
      const newFrame = Math.floor(Date.now()*1E-2)%7+1
      newFrame!==frame && setFrame(newFrame)
    }
    const binding = clouding.add(play=>{
      setPlaying(play)
      if (play) {
        animating = animate.add(anim)
      } else {
        animating&&animating.detach()
      }
    })
    return ::binding.detach
  }, [])

  return <Svg
      x="0px"
      y="0px"
      width="32px"
	    height="32px"
      viewBox="0 0 32 32"
      playing={playing}
  >
	<path d="M25,25.6l-7.3-11.6l-12.6,7l-1.3,4.6H25z"/>
	<g id="c1">
		<circle cx="3.8" cy="23.6" r="2.0"/>
		<circle cx="6.0" cy="19.9" r="3.1"/>
		<circle cx="11.6" cy="15.8" r="4.6"/>
		<circle cx="22.1" cy="13.9" r="7.0"/>
		<circle cx="25.0" cy="20.9" r="4.6"/></g>
	<g id="c2">
		<circle cx="4.0" cy="22.1" r="2.2"/>
		<circle cx="6.8" cy="19.2" r="3.5"/>
		<circle cx="12.7" cy="15.3" r="5.0"/>
		<circle cx="22.8" cy="14.3" r="6.8"/>
		<circle cx="24.8" cy="21.3" r="4.4"/>
		<circle cx="3.8" cy="24.9" r="0.7"/></g>
	<g id="c3">
		<circle cx="4.0" cy="22.3" r="2.0"/>
		<circle cx="7.2" cy="18.1" r="3.4"/>
		<circle cx="13.4" cy="14.4" r="4.9"/>
		<circle cx="23.5" cy="14.8" r="6.5"/>
		<circle cx="24.9" cy="21.6" r="4.0"/>
		<circle cx="4.0" cy="24.8" r="1.1"/></g>
	<g id="c4">
		<circle cx="4.4" cy="21.3" r="2.2"/>
		<circle cx="8.1" cy="17.4" r="3.6"/>
		<circle cx="14.8" cy="13.7" r="5.3"/>
		<circle cx="24.0" cy="15.7" r="6.3"/>
		<circle cx="25.0" cy="22.0" r="3.7"/>
		<circle cx="4.0" cy="24.4" r="1.3"/></g>
	<g id="c5">
		<circle cx="5.3" cy="22.6" r="2.1"/>
		<circle cx="8.8" cy="16.9" r="3.9"/>
		<circle cx="16.4" cy="13.3" r="5.6"/>
		<circle cx="24.6" cy="17.1" r="6.0"/>
		<circle cx="25.0" cy="22.4" r="3.2"/>
		<circle cx="4.0" cy="24.2" r="1.4"/></g>
	<g id="c6">
		<circle cx="5.3" cy="20.5" r="2.7"/>
		<circle cx="10.0" cy="16.1" r="4.3"/>
		<circle cx="18.3" cy="13.1" r="5.9"/>
		<circle cx="24.8" cy="18.4" r="5.6"/>
		<circle cx="25.1" cy="22.9" r="2.7"/>
		<circle cx="3.9" cy="24.1" r="1.6"/></g>
	<g id="c7">
		<circle cx="5.6" cy="20.3" r="3.0"/>
		<circle cx="11.1" cy="15.8" r="4.5"/>
		<circle cx="20.9" cy="12.8" r="5.8"/>
		<circle cx="24.8" cy="19.4" r="5.3"/>
		<circle cx="25.0" cy="23.4" r="2.2"/>
		<circle cx="3.9" cy="23.8" r="1.8"/></g>
  </Svg>
}