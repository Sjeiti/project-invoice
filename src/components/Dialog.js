import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {CSSTransition,TransitionGroup} from 'react-transition-group'
import {Button, IconButton} from './Button'
import {color, size} from '../cssService'
import {useWindowDimensions} from '../hook/useWindowDimensions'
import {useWindowScroll} from '../hook/useWindowScroll'
import {useKeyDown} from '../hook/useKeyDown'

const {shadeFlat, colorLightBg, colorButton} = color
const {padding, borderRadius} = size

const StyledDialog = styled.div`
  position: fixed;
  left: 50vw;
  top: 50vh;
  z-index: 99;
  margin: 0;
  transform: translate(-50%, -50%);
    padding: 0;
    min-width: 15rem;
    max-width: calc(100vw - 2rem);
    border: 0;
    box-shadow: 0 0 0 1px ${colorButton}, ${shadeFlat};
    background-color: white;
    border-radius: ${borderRadius};
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
      padding: 0;
      background: rgba(0, 0, 0, 0.1);
      box-shadow: 0 0 16rem rgba(0, 0, 0, 0.3) inset;
    }
`

export const Dialog = attr => {
  const [elmDialog, setElmDialog] = useState()
  const [svg, setSVG] = useState(<svg/>)
  const [animating, setAnimating] = useState(false)
  const { width:winW, height:winH } = useWindowDimensions()
  const {scrollY} = useWindowScroll()
  const {Escape, Enter} = useKeyDown()
  //
  const {source, show, title, children, close, submit} = attr
  //
  useEffect(()=>{show&&Escape&&close()}, [Escape])
  useEffect(()=>{show&&Enter&&submit()}, [Enter])
  //
  useEffect(()=>{
    // bounding rect of elmDialog is only set correctly on next frame
    requestAnimationFrame(()=>{
      const sourceRect = source?.getBoundingClientRect()
      const targetRect = elmDialog?.getBoundingClientRect()
      sourceRect&&targetRect&&setSVG(drawSVG(winW, winH, sourceRect, targetRect))
    })
  }
  , [elmDialog, source, winW, winH, scrollY, show, animating])
  //
  return <>
      <CSSTransition
        in={show}
        timeout={200}
        classNames="anim-tv"
        onEntered={()=>setAnimating(!animating)}
      >
        {show&&<>
          <StyledDialog ref={setElmDialog} {...attr}>
            <header><h3>{Enter&&1}{title}</h3> <IconButton type="close" invert onClick={close}></IconButton></header>
            <section>{children}</section>
            <footer className="text-align-right">
              <Button onClick={close}>cancel</Button>
              <Button onClick={submit}>submit</Button>
            </footer>
          </StyledDialog>
        </>||<></>}
      </CSSTransition>
      <CSSTransition
        in={show}
        timeout={200}
        classNames="anim-opacity"
      >
        {show&&<>{svg}</>||<></>}
      </CSSTransition>
    </>
}

/**
 * Convert vertex list to svg path[d] string
 * @param {number[]} pos
 * @return {string}
 */
function positionsToPathD(pos){
	return pos.reduce((acc, v, i)=>acc+v+(i%2&&(i===pos.length-1&&'Z'||'L')||' '), 'M')
}

/**
 * Draw an SVG element displaying movement from sourceRect to targetRect
 * @param {number} w
 * @param {number} h
 * @param {object} sourceRect
 * @param {object} targetRect
 * @return {ReactElement}
 */
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
      <stop offset="0%"  stopColor="#2194C9" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#2194C9" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="myGradient2">
      <stop offset="0%" stopColor="#2194C9" stopOpacity="0" />
      <stop offset="100%"  stopColor="#2194C9" stopOpacity="0.2" />
    </linearGradient>
  </defs>
    <path d={pathLeft} fill="url('#myGradient')"></path>
    <path d={pathRight} fill="url('#myGradient2')"></path>
    <path d={pathBottomRect} fill="#2194C9" fillOpacity="0.15"></path>
  </svg>
}