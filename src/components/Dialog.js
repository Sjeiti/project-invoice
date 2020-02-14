import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import {CSSTransition} from 'react-transition-group'
import {Button, IconButton} from './Button'
import {color, size} from '../service/css'
import {useWindowDimensions} from '../hook/useWindowDimensions'
import {useWindowScroll} from '../hook/useWindowScroll'
import {useKeyDown} from '../hook/useKeyDown'
import {T} from '../components/T'

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
    width: 100vw;
    height: 100vh;
    padding: 0;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 16rem rgba(0, 0, 0, 0.3) inset;
  }
`

export const Dialog = attr => {
  const [elmDialog, setElmDialog] = useState()
  const [svg, setSVG] = useState(<svg/>)
  const { width:winW, height:winH } = useWindowDimensions()
  const {scrollY} = useWindowScroll()
  const {Escape, Enter} = useKeyDown()
  //
  const {show, title, children, close, submit, source, sourceTransform} = attr
  //
  // flip while animating
  const animating = useRef(false)
  const animate = useRef(false)
  animating.current&&(animate.current=!animate.current)
  //
  // keyboard actions
  useEffect(()=>{show&&Escape&&close()}, [Escape])
  useEffect(()=>{show&&Enter&&submit()}, [Enter])
  //
  useEffect(()=>{
    // bounding rect of elmDialog is only set correctly on next frame
    requestAnimationFrame(()=>{
      const sourceRect = source?.getBoundingClientRect()
      const targetRect = elmDialog?.getBoundingClientRect()
      sourceRect&&targetRect&&setSVG(drawSVG(winW, winH, sourceTransform&&sourceTransform(sourceRect)||sourceRect, targetRect))
    })
  }
  , [elmDialog, source, winW, winH, scrollY, show, animate.current])
  //
  return <>
      <CSSTransition
        in={show}
        timeout={200}
        classNames="anim-tv"
        unmountOnExit={true}
        onEntering={()=>animating.current = true}
        onEntered={()=>animating.current = false}
        onExiting={()=>animating.current = true}
        onExited={()=>animating.current = false}
      >
          <StyledDialog ref={setElmDialog} {...attr}>
            <header><h3>{Enter&&1}{title}</h3> <IconButton type="close" invert onClick={close}></IconButton></header>
            <section>{children}</section>
            <footer className="text-align-right">
              <Button onClick={close}><T>cancel</T></Button>
              <Button onClick={submit}><T>ok</T></Button>
            </footer>
          </StyledDialog>
      </CSSTransition>
      <CSSTransition
        in={show}
        timeout={200}
        classNames="anim-opacity"
        unmountOnExit={true}
      >
        {svg}
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
  const pathBottomRect = positionsToPathD([
      sourceRect.right, sourceRect.bottom
      , sourceRect.left, sourceRect.bottom
      , sourceRect.left, sourceRect.top
      , sourceRect.right, sourceRect.top
  ])
  const pathFull = positionsToPathD([
      targetRect.left, targetRect.top
      , targetRect.right, targetRect.top
      , sourceRect.right, sourceRect.top
      , sourceRect.right, sourceRect.bottom
      , sourceRect.left, sourceRect.bottom
      , sourceRect.left, sourceRect.top
  ])
  return <svg version="1.1"
     xmlns="http://www.w3.org/2000/svg"
     preserveAspectRatio="xMidYMid meet"
     viewBox={'0 0 '+w+' '+h}
     width={w}
     height={h}>
  <defs>
    <radialGradient id="radialGradient" cy="10%" r="100%" fy="10%">
      <stop offset="20%" stopColor="#2194C9" stopOpacity="0" />
      <stop offset="100%" stopColor="#2194C9" stopOpacity="0.1" />
    </radialGradient>
  </defs>
    <path d={pathFull} fill="url('#radialGradient')"></path>}
    <path d={pathBottomRect} fill="#2194C9" fillOpacity="0.05"></path>
  </svg>
}