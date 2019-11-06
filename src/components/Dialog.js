import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Button, IconButton} from './Button'
import {color, size} from '../cssService'
import {useWindowDimensions} from '../hook/useWindowDimensions'
import {useWindowScroll} from '../hook/useWindowScroll'

// const dim = document.createElement('div').getBoundingClientRect()
const {shadeFlat, colorLightBg, colorButton} = color
const {padding, borderRadius, headerHeight} = size

const StyledDialog = styled.div`//dialog div
    //position: fixed;
    //top: 50%;
    //left: 50%;
    //transform: translate(-50%,-50%);
    //width: 400px;
  position: fixed;
  left: 50vw;
  top: 50vh;
  z-index: 99;
  display: ${props => props.show&&'block'||'none'}
  margin: 0;
  transform: translate(-50%, -50%);
    padding: 0;
    min-width: 15rem;
    max-width: calc(100vw - 2rem);
    border: 0;
    box-shadow: 0 0 0 1px ${colorButton}, ${shadeFlat};
    background-color: white;
    border-radius: ${borderRadius};
    //opacity: 0;
    //transition: opacity 200ms linear, transform 200ms linear;
    //&[open] { opacity: 1; }
    //svg {
    //  position: static;
    //  left: 0;
    //  top: 0;
    //  padding: 0;
    //  pointer-events: none;
    //}
    header {
      background-color: ${colorLightBg};
      border-top-left-radius: ${borderRadius};
      border-top-right-radius: ${borderRadius};
      button {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    h3 {
      margin: 0;
      padding: 0;
      font-size: 1rem;
      line-height: 1rem;
    }
    >*{ padding: ${padding}; }
    footer {
     padding-top: 0;
     button { margin-bottom: 0; }
    }
    & + svg {
      position: fixed;
      left: 0;
      top: 0;
      // top: ${headerHeight};
      display: ${props => props.show&&'block'||'none'}
      //width: 100vw;
      //height: calc(100% - ${headerHeight});
      padding: 0;
      //pointer-events: none;
      background: rgba(0, 0, 0, 0.2);
    }
    &::backdrop {
      background: transparent;
    }
`

export const Dialog = attr => {
  const [elmDialog, setElmDialog] = useState()
  const [svg, setSVG] = useState()//useState(dim)
  const { width:winW, height:winH } = useWindowDimensions()
  const {scrollY} = useWindowScroll()
  //
  const {source, show, title, children, close, submit} = attr
  //
  useEffect(()=>{
    // bounding rect of elmDialog is only set correctly on next frame
    requestAnimationFrame(()=>{
      const sourceRect = source?.getBoundingClientRect()
      const targetRect = elmDialog?.getBoundingClientRect()
      sourceRect&&targetRect&&setSVG(drawSVG(winW, winH, sourceRect, targetRect))
    })
  }
  , [elmDialog, source, winW, winH, scrollY])
  //
  useEffect(()=>{
    // open dialogs throw error when calling showModal
    show?!elmDialog?.open&&elmDialog?.showModal?.():elmDialog?.open&&elmDialog?.close()
  })
  //
  return <><StyledDialog ref={setElmDialog} {...attr}>
    <header><h3>{title}</h3> <IconButton type="close" invert onClick={close}></IconButton></header>
    <section>{children}</section>
    <footer className="text-align-right">
      <Button onClick={close}>cancel</Button>
      <Button onClick={submit}>submit</Button>
    </footer>
  </StyledDialog>{svg}<p>{show}</p></>}

function positionsToPathD(pos){
	return pos.reduce((acc, v, i)=>acc+v+(i%2&&(i===pos.length-1&&'Z'||'L')||' '), 'M')
}

function drawSVG(w, h, sourceRect, targetRect){
  const pathLeft = positionsToPathD([
      sourceRect.left, sourceRect.top
      , sourceRect.left, sourceRect.bottom
      , targetRect.left, targetRect.bottom
      , targetRect.left, targetRect.top
  ])
  const pathRight = positionsToPathD([
      sourceRect.right, sourceRect.top
      , sourceRect.right, sourceRect.bottom
      , targetRect.right, targetRect.bottom
      , targetRect.right, targetRect.top
  ])
  // const pathBottom = positionsToPathD([
  //     sourceRect.right, sourceRect.bottom
  //     , sourceRect.left, sourceRect.bottom
  //     , targetRect.left, targetRect.bottom
  //     , targetRect.right, targetRect.bottom
  // ])
  const pathBottomRect = positionsToPathD([
      sourceRect.right, sourceRect.bottom
      , sourceRect.left, sourceRect.bottom
      , sourceRect.left, sourceRect.top
      , sourceRect.right, sourceRect.top
  ])
  return <svg version="1.1"
     xmlns="http://www.w3.org/2000/svg"
     preserveAspectRatio="xMidYMid meet"
     viewBox={'0 0 '+w+' '+h}
     width={w}
     height={h}>
  <defs>
    <linearGradient id="myGradient">
      <stop offset="0%"  stopColor="#FFF" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="myGradient2">
      <stop offset="0%" stopColor="#FFF" stopOpacity="0" />
      <stop offset="100%"  stopColor="#FFF" stopOpacity="0.2" />
    </linearGradient>
  </defs>
    <path d={pathLeft} fill="url('#myGradient')"></path>
    <path d={pathRight} fill="url('#myGradient2')"></path>
    {/*<path d={pathLeft} fill="#FFF" fillOpacity="0.15"></path>*/}
    {/*<path d={pathRight} fill="#FFF" fillOpacity="0.15"></path>*/}
    {/*<path d={pathBottom} fill="#FFF" fillOpacity="0.15"></path>*/}
    <path d={pathBottomRect} fill="#FFF" fillOpacity="0.15"></path>
  </svg>
}