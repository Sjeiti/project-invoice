import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import clr from 'color-js'
import {InputText, InputColor} from '../components/Input'
import {color} from '../cssService'
import { Signal } from 'signals'

const closeExcept = new Signal()

const StyledPopup = styled.div`
  position: fixed;
  left: ${prop=>prop.popupX}px;
  top: ${prop=>prop.popupY}px;
  z-index: 99;
  background-color: green;
  box-shadow: ${color.shadeFlat};
  display: ${prop=>prop.show&&'block'||'none'};
  >div:first-child {
    position: relative;
    width: 200px;
    height: 100px;
    background:
      linear-gradient(to top, black, rgba(0,0,0,0)),
      linear-gradient(to left, ${prop=>prop.hueColor}, white)
    ;
    &>div{
      position: absolute;
      left: ${prop=>prop.saturation*100}%;
      top: ${prop=>100-prop.value*100}%;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 1rem;
      box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
      transform: translate(-50%,-50%);
      pointer-events: none;
    }
    & + div {
      position: relative;
      height: 1rem;
      background: linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
      & > div{
        position: absolute;
        left: ${prop=>parseInt(prop.hue/3.6,10)}%;
        top: 0;
        width: 5px;
        transform: translateX(-2px);
        height: inherit;
        box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
        pointer-events: none;
      }
    }
  }
  input {
    width: 100%;
    margin: 0;
  }
`

export const ColorPicker = ({...props})=>{

  // const {current:ref} = useRef(Symbol())
  const [ref] = useState({})
  const [show, setShow] = useState(false)

  const [popupX, setPopupX] = useState(0)
  const [popupY, setPopupY] = useState(0)

  const [color, setColor] = useState(clr(props.value))
  const [hueColor, sethueColor] = useState(clr(color).setSaturation(1).setLightness(0.5))

  useEffect(()=>{
    const hide = currentRef => {
      ref!==currentRef&&setShow(false)
    }
    closeExcept.add(hide)
    return ()=>closeExcept.remove(hide)
  }, [])

  function onClickInput(e){
    e.preventDefault()
    closeExcept.dispatch(ref)
    setShow(true)
    const rect = e.target.getBoundingClientRect()
    setPopupX(rect.right)
    setPopupY(rect.top)
  }
  function onClickPopup(e){
    e.preventDefault()
  }

  /**
   * Click handler for the main color area
   * @param {MouseEvent} e
   */
  function onClickColor(e){
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newColor = color.setSaturation(x/rect.width).setValue(1-y/rect.height)
    setColor(newColor)
    props.setter(newColor.toString())
  }

  /**
   * Click handler for the hue bar
   * @param {MouseEvent} e
   */
  function onClickHue(e){
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const hue = x/rect.width*360
    sethueColor(hueColor.setHue(hue))
    const newColor = color.setHue(hue)
    setColor(newColor)
    props.setter(newColor.toString())
  }

  return <>
      <InputColor onClick={onClickInput} {...props} />
      <StyledPopup
          hueColor={hueColor?.toString()}
          hue={color.getHue()}
          saturation={color.getSaturation()}
          lightness={color.getLightness()}
          value={color.getValue()}
          show={show}
          onClick={onClickPopup}
          popupX={popupX}
          popupY={popupY}
      >
        <div onClick={onClickColor}><div></div></div>
        <div onClick={onClickHue}><div></div></div>
        <InputText value={color.toString()}></InputText>
      </StyledPopup>
  </>
}
