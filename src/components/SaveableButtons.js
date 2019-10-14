import React, { useState, useEffect } from 'react'
import { Button } from './Button'
import { saveable } from '../saveable'
import { withRouter } from 'react-router-dom'
import { noop } from '../utils'
import styled from 'styled-components'
import {size} from '../cssService'

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

  useEffect(() => {
    const binding = saveable.add((saveable, save, revert, deleet) => {
      setSave(() => save) // methods cannot be set directly, only as return value
      setRevert(() => revert)
      setDelete(() => deleet)
      setSaveable(saveable)
    })
    return ::binding.detach
  }, [])

  return (
    <Nav style={{ display: isSaveable ? 'block' : 'none' }}>
      <Button onClick={save} disabled={!save}>save</Button>
      <Button onClick={revert} disabled={!revert}>revert</Button>
      <Button onClick={deleet} disabled={!deleet}>delete</Button>
    </Nav>
  )
})
