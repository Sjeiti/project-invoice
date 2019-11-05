import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Button, IconButton} from './Button'
import {color, size} from '../cssService'

const {shadeFlat, colorLightBg, colorButton} = color
const {padding, borderRadius} = size

const StyledDialog = styled.dialog`
    //position: fixed;
    //top: 50%;
    //left: 50%;
    //transform: translate(-50%,-50%);
    //width: 400px;
    padding: 0;
    min-width: 300px;
    max-width: calc(100vw - 2rem);
    border: 0;
    box-shadow: 0 0 0 1px ${colorButton}, ${shadeFlat};
    background-color: white;
    border-radius: ${borderRadius};
    //opacity: 0;
    //transition: opacity 200ms linear, transform 200ms linear;
    //&[open] { opacity: 1; }
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
    &::backdrop, dialog + .backdrop {
      background: rgba(0, 0, 0, 0.2);
    }
`

export const Dialog = attr => {
  const [elmDialog, setElmDialog] = useState()
  useEffect(()=>{
    // open dialogs throw error when calling showModal
    attr.show?!elmDialog?.open&&elmDialog?.showModal():elmDialog?.open&&elmDialog?.close()
  })

  return <StyledDialog ref={setElmDialog} {...attr}>
    <header><h3>{attr.title}</h3> <IconButton type="close" invert onClick={attr.close}></IconButton></header>
    <section>{attr.children}</section>
    <footer className="text-align-right">
      <Button onClick={attr.close}>cancel</Button>
      <Button onClick={attr.submit}>submit</Button>
    </footer>
  </StyledDialog>
}
