import React,{useState,useEffect,useMemo} from 'react'
import styled from 'styled-components'
// import { saveable } from '../util/signal'
import { noop } from '../util'
import { withRouter } from '../util/withRouter'
import { Button, IconButton } from './Button'
import { T } from './T'
import {useLocationEffect} from '../hook/useLocationEffect'
import {connect} from 'react-redux'
import {getConfig} from '../model/config/selectors'
import {getSession} from '../model/session/selectors'
import {getClients} from '../model/clients/selectors'
import {storeConfig} from '../model/config/actions'
import {restoreState} from '../model/rootActions'
import {storeSession} from '../model/session/actions'
import {useLocation} from 'react-router-dom'

const Nav = styled.nav`
  padding: 4px 4px 0 0;
`

export const SaveableButtons = connect(
    state => ({session: getSession(state)/*, state */})
    , {storeSession}
  )(props => {

  const {session, storeSession} = props
  const {saveable, save, revert, deleet} = session
  console.log('SaveableButtons', saveable) // todo: remove log

  // const [isSaveable, setSaveable] = useState(false)
  //
  // const [save, setSave] = useState(noop)
  // const [revert, setRevert] = useState(noop)
  // const [deleet, setDelete] = useState(noop)

  // const { history } = props
  // history.listen(()=>setSaveable(false))
  // useLocationEffect(()=>setSaveable(false))

  // useLocationEffect(()=>storeSession({saveable:false}))
  // useLocationEffect(()=>requestAnimationFrame(()=>storeSession({saveable:false})))

  // const call = useMemo(()=>console.log.bind(console, 'useLocationEffect'), [])
  // const call = useMemo(()=>()=>{
  //   storeSession({saveable:false})
  //   console.log('useLocationEffect saveable.',false) // todo: remove log
  // }, [])
  // useLocationEffect(call)

  // const location = useLocation()
  // useEffect(()=>storeSession({saveable:false}), [location])
  // useEffect(()=>requestAnimationFrame(()=>storeSession({saveable:false})), [location])

  // // saveable signal binding
  // useEffect(() => {
  //   const binding = saveable.add((saveable, save, revert, deleet) => {
  //     console.log('saveable',{saveable, save, revert, deleet}) // todo: remove log
  //     requestAnimationFrame(()=>{ // to prevent: Cannot update a component (`Unknown`) while rendering a different component
  //       setSave(() => save) // methods cannot be set directly, only as return value
  //       setRevert(() => revert)
  //       setDelete(() => deleet)
  //       setSaveable(saveable)
  //     })
  //   })
  //   return ::binding.detach
  // }, [setSaveable, setSave, setRevert, setDelete])

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
