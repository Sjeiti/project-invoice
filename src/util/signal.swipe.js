import {signal} from './signal'

// todo duration and distance might be nice to set

export const swipeLeft = signal()
export const swipeRight = signal()

const bound = []
document.addEventListener('touchstart',onTouchStart)

const rad = Math.PI/8
const sin = Math.sin(rad)
const cos = Math.cos(rad)
const edge = cos/sin

/**
 * Touch start event handler
 * @param {TouchEvent} e
 */
function onTouchStart(e){
  const touchEnd = onTouchEnd.bind(null,e)
  bound.push(touchEnd)
  document.addEventListener('touchend',touchEnd)
}

/**
 * Touch end event handler
 * removes bound listeners
 * @param {TouchEvent} eStart
 * @param {TouchEvent} eEnd
 */
function onTouchEnd(eStart,eEnd){
  document.removeEventListener('touchend',bound.pop())
  const duration = eEnd.timeStamp-eStart.timeStamp
  const startAverage = averageTouchPosition(eStart)
  const endAverage = averageTouchPosition(eEnd)
  const offset = {
    x: endAverage.x - startAverage.x
    ,y: endAverage.y - startAverage.y
  }
  const distance = Math.sqrt(offset.x*offset.x + offset.y*offset.y)
  const aspectRatio = offset.x/offset.y
  const isHorizontal = Math.abs(aspectRatio)>edge
  //const isVertical = Math.abs(aspectRatio)<1/edge
  //const isDiagonal = !isHorizontal&&!isVertical
  const parameters = [startAverage,endAverage,duration,distance,offset,eStart,eEnd]
  if (duration<400&&distance>100){
    isHorizontal&&(offset.x<0?swipeLeft:swipeRight).dispatch(...parameters)
  }
}

/**
 * Calculate average touch position
 * @param {TouchEvent} e
 * @returns {{x: number, y: number}}
 */
function averageTouchPosition(e){
  const touches = Array.from(e.changedTouches)
  const numTouches = touches.length
  return {
    x: touches.map(t=>t.screenX).reduce((a,b)=>a+b)/numTouches
    ,y: touches.map(t=>t.screenY).reduce((a,b)=>a+b)/numTouches
  }
}