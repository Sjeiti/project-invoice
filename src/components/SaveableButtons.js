import React, {useEffect} from 'react'
import styled from 'styled-components'
import { Button, IconButton } from './Button'
import { T } from './T'
import {connect} from 'react-redux'
import {getSession} from '../model/session/selectors'

const Nav = styled.nav`
  padding: 4px 4px 0 0;
`

export const SaveableButtons = connect(
    state => ({session: getSession(state)})
  )(props => {

  const {session} = props
  const {saveable, save, revert, deleet} = session

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
  }, [save, revert])

  return (
    <Nav style={{ display: saveable ? 'block' : 'none' }}>
      <Button data-cy="save" className="hide-low" onClick={save} disabled={!save}><T>save</T></Button>
      <Button data-cy="revert" className="hide-low" onClick={revert} disabled={!revert}><T>revert</T></Button>
      <Button data-cy="delete" className="hide-low" onClick={deleet} disabled={!deleet}><T>delete</T></Button>
      <IconButton data-cy="saveIcon" type="save" className="hide-high" onClick={save} disabled={!save} />
      <IconButton data-cy="revertIcon" type="revert" className="hide-high" onClick={revert} disabled={!revert} />
      <IconButton data-cy="deleteIcon" type="delete" className="hide-high" onClick={deleet} disabled={!deleet} />
    </Nav>
  )
})
