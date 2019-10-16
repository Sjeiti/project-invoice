import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { saveable } from '../saveable'
import { noop } from '../utils'
import {size} from '../cssService'
import { Button } from './Button'
import { T } from './T'

const {padding} = size

const Nav = styled.nav`
  position: absolute;
  right: ${padding};
  top: 0;
  padding: 4px 4px 0 0;
`

export const SaveableButtons = withRouter(props => {
  const [isSaveable, setSaveable] = useState(false)

  const [save, setSave] = useState(noop)
  const [revert, setRevert] = useState(noop)
  const [deleet, setDelete] = useState(noop)

  const { history } = props

  history.listen(()=>setSaveable(false))

  // saveable signal binding
  useEffect(() => {
    const binding = saveable.add((saveable, save, revert, deleet) => {
      setSave(() => save) // methods cannot be set directly, only as return value
      setRevert(() => revert)
      setDelete(() => deleet)
      setSaveable(saveable)
    })
    return ::binding.detach
  }, [])

  // CTRL save
  useEffect(()=>{
    function onKeyDown(e){
      if ((e.metaKey||e.ctrlKey)&&e.key==='s'){
        e.preventDefault()
        save&&save()
      }
    }
    document.addEventListener('keydown', onKeyDown, false)
    return ()=>document.removeEventListener('keydown', onKeyDown, false)
  }) // , []

  return (
    <Nav style={{ display: isSaveable ? 'block' : 'none' }}>
      <Button onClick={save} disabled={!save}><T>save</T></Button>
      <Button onClick={revert} disabled={!revert}><T>revert</T></Button>
      <Button onClick={deleet} disabled={!deleet}><T>delete</T></Button>
    </Nav>
  )
})
