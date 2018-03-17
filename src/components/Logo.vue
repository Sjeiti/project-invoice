<template>
  <svg v-bind:width="size" v-bind:height="size" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'Logo'
  ,data(){
    return {
      size: 28
    }
  }
  ,mounted(){

    const size = this.size
    const sizeh = size/2
    const triRad = Math.PI/3
    const svg = this.$el
    const create = name=>document.createElementNS('http://www.w3.org/2000/svg',name)
    const setColor = (element,color)=>element.setAttribute('style',`fill:${color};`) // stroke:${color};
    const setTransform = (element,x,y,rotation)=>element.setAttribute('transform',`translate(${x},${y}) rotate(${rotation})`)

    const hexPoints = Array.from(new Array(6)).map((o,i)=>[sizeh*Math.cos(i*triRad),sizeh*Math.sin(i*triRad)])

    const group = create('g')
    group.setAttribute('transform',`translate(${sizeh},${sizeh}) rotate(75)`)
    svg.appendChild(group)
    //
    const hexagon = create('polygon')
    hexagon.setAttribute('points',hexPoints.map(v=>v.join(',')).join(' '))
    setColor(hexagon,'#666')
    group.appendChild(hexagon)
    //
    //const rhombus = drawRhombus(group, '#0275d8')
    //const triangle = drawTriangle(group, '#f04')
    const rhombus = drawRhombus(group,'#999')
    const triangle = drawTriangle(group,'#CCC')

    const timeline = [
      ()=>rotateElement(triangle,hexPoints,3)
      ,()=>rotateElement(triangle,hexPoints,4)
      ,()=>rotateElement(rhombus,hexPoints,2)
      ,()=>rotateElement(triangle,hexPoints,5)
      ,()=>rotateElement(triangle,hexPoints,0)
      ,()=>rotateElement(rhombus,hexPoints,4)
      ,()=>rotateElement(triangle,hexPoints,1)
      ,()=>rotateElement(triangle,hexPoints,2)
      ,()=>rotateElement(rhombus,hexPoints,0)
    ]
    let timelineIndex = 0
    rotateElement(triangle,hexPoints,2,0,false)
    rotateElement(rhombus,hexPoints,0,0)

    /**
     * Rotate an element
     * @param {Node} elm
     * @param {number[]} points
     * @param {number} index
     * @param {number} [t=150]
     * @param {boolean} [complete=true]
     * @returns {object}
     */
    function rotateElement(elm,points,index,t=150,complete=true){
      const point = points[index]
      const [x,y] = point
      const numPoints = points.length
      const startRotation = (index+3)%numPoints*60
      setTransform(elm,x,y,startRotation)
      const obj = { val: startRotation }
      return anime({
        targets: obj
        ,val: startRotation-60
        ,duration: t
        ,easing: 'easeInOutQuart'
        ,update: ()=>setTransform(elm,x,y,obj.val)
        ,complete: ()=>{
          if (complete&&timelineIndex<timeline.length){
            timeline[timelineIndex++%timeline.length]()
          }
        }
      })
    }

    /**
     * Draw a triangle
     * @param {Node} group
     * @param {string} color
     * @param {number[]} position
     * @param {number} rotation
     * @returns {Node}
     */
    function drawTriangle(group,color='#f00',position=[0,0],rotation=0){
      const [x,y] = position
      const triangle = create('polygon')
      const trianglePoints = [[0,0],[sizeh,0],hexPoints[1]]
      triangle.setAttribute('points',trianglePoints.map(v=>v.join(',')).join(' '))
      setColor(triangle,color)
      setTransform(triangle,x,y,rotation)
      group.appendChild(triangle)
      return triangle
    }

    /**
     * Draw a rhombus
     * @param {Node} group
     * @param {string} color
     * @param {number[]} position
     * @param {number} rotation
     * @returns {Node}
     */
    function drawRhombus(group,color='#f00',position=[0,0],rotation=0){
      const [x,y] = position
      const rhombus = create('polygon')
      const rhombusPoints = [[0,0],...hexPoints.slice(1,4)].map(p=>p.map((n,i)=>n+hexPoints[0][i]))
      rhombus.setAttribute('points',rhombusPoints.map(v=>v.join(',')).join(' '))
      setColor(rhombus,color)
      setTransform(rhombus,x,y,rotation)
      group.appendChild(rhombus)
      return rhombus
    }

  }
}
</script>