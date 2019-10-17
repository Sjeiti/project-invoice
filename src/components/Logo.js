import React, {useEffect, useRef, useState} from 'react'
import anime from 'animejs'

const triRad = Math.PI/3

export const Logo = ({ size=32, colors, ...attrs }) => {
  //xmlns:xlink="http://www.w3.org/1999/xlink"

  const sizeh = size/2
  const hexPoints = Array.from(new Array(6)).map((o, i)=>[sizeh*Math.cos(i*triRad), sizeh*Math.sin(i*triRad)])

  getRhombusPoints(hexPoints)

  const transformGroup = `translate(${sizeh},${sizeh}) rotate(75)`

  const rhoRef = useRef(null)
  const triRef = useRef(null)
  const [rhoState, setRhoState] = useState(getTransform(hexPoints, 2))
  const [triState, setTriState] = useState(getTransform(hexPoints, 0))
  const rhoAnim = rotateElement.bind(null, setRhoState, hexPoints)
  const triAnim = rotateElement.bind(null, setTriState, hexPoints)

  useEffect(() => {
    const time = 300
    const timeline = [
       (...arg)=>triAnim(3, time, ...arg)
      , (...arg)=>triAnim(4, time, ...arg)
      , (...arg)=>rhoAnim(2, time, ...arg)
      , (...arg)=>triAnim(5, time, ...arg)
      , (...arg)=>triAnim(0, time, ...arg)
      , (...arg)=>rhoAnim(4, time, ...arg)
      , (...arg)=>triAnim(1, time, ...arg)
      , (...arg)=>triAnim(2, time, ...arg)
      , (...arg)=>rhoAnim(0, time, ...arg)
    ]
    rhoAnim(0, 0)
    const anim = triAnim(2, 0, timeline, 0)
    return ()=>anim.anim.pause()
  }, [rhoAnim, triAnim])

  return <svg width={size} height={size} {...attrs}>
    <g transform={transformGroup}>
      <polygon style={{fill:colors?.[0]||'#666'}} points={pointWrap(hexPoints)} />
      <polygon style={{fill:colors?.[1]||'#999'}} points={getRhombusPoints(hexPoints)}         ref={rhoRef} transform={rhoState} />
      <polygon style={{fill:colors?.[2]||'#CCC'}} points={getTrianglePoints(hexPoints, sizeh)} ref={triRef} transform={triState} />
    </g>
  </svg>
}

/**
 * Apply animation to state of svg element
 * @param {Node} setState
 * @param {number[]} points
 * @param {number} index
 * @param {number} [t=150]
 * @param {Function[]} timeline
 * @param {number} timelineIndex
 * @param {object} anim
 * @returns {object}
 */
function rotateElement(setState, points, index, t=150, timeline, timelineIndex, anim={}){
  const numPoints = points.length
  const startRotation = (index+3)%numPoints*60
  setState(getTransform(points, index, startRotation))
  const obj = { val: startRotation }
  anim.anim = anime({
    targets: obj
    , val: startRotation-60
    , duration: t
    , easing: 'easeInOutQuart'
    , update: ()=>setState(getTransform(points, index, obj.val))
    , complete: ()=>{
      timeline&&timelineIndex<timeline.length
        &&timeline[timelineIndex++%timeline.length](timeline, timelineIndex, anim)
    }
  })
  return anim
}

/**
 * Get transformation string based in index in point list
 * @param {number[][]} points
 * @param {number} index
 * @param {number} rotation
 * @return {string}
 */
function getTransform(points, index, rotation){
  const point = points[index]
  const [x, y] = point
  const numPoints = points.length
  const startRotation = (index+3)%numPoints*60
  return `translate(${x},${y}) rotate(${rotation||(startRotation - 60)})`
}

/**
 * Wrap point list to svg point string
 * @param {number[][]} points
 * @return {string}
 */
function pointWrap(points){
  return points
      .map(a=>a.map(n=>n.toFixed(3)).join(','))
      .join(' ')
}

/**
 * Get svg points string for rhombus
 * @param {number[][]} hexPoints
 * @return {string}
 */
function getRhombusPoints(hexPoints){
  return pointWrap([[0, 0], ...hexPoints.slice(1, 4)].map(p => p.map((n, i) => n + hexPoints[0][i])))
}


/**
 * Get svg points string for triangle
 * @param {number[][]} hexPoints
 * @param {number} sizeh
 * @return {string}
 * @todo: sizeh could be extracted from point list
 */
function getTrianglePoints(hexPoints, sizeh){
  return pointWrap([[0, 0], [sizeh, 0], hexPoints[1]])
}