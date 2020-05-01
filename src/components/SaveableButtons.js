import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { saveable } from '../util/signal'
import { noop } from '../util'
import { Button, IconButton } from './Button'
import { T } from './T'

const Nav = styled.nav`
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
      const {metaKey, ctrlKey, key} = e
      if (metaKey||ctrlKey){
        if (key==='s'){
          e.preventDefault()
          save&&save()
        } else if (key==='z') {
          e.preventDefault()
          revert&&revert()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown, false)
    return ()=>document.removeEventListener('keydown', onKeyDown, false)
  }) // , []

  return (
    <Nav style={{ display: isSaveable ? 'block' : 'none' }}>
      <Button data-cy="save" className="hide-low" onClick={save} disabled={!save}><T>save</T></Button>
      <Button data-cy="revert" className="hide-low" onClick={revert} disabled={!revert}><T>revert</T></Button>
      <Button data-cy="delete" className="hide-low" onClick={deleet} disabled={!deleet}><T>delete</T></Button>
      <IconButton data-cy="saveIcon" type="save" className="hide-high" onClick={save} disabled={!save} />
      <IconButton data-cy="revertIcon" type="revert" className="hide-high" onClick={revert} disabled={!revert} />
      <IconButton data-cy="deleteIcon" type="delete" className="hide-high" onClick={deleet} disabled={!deleet} />
    </Nav>
  )
})
