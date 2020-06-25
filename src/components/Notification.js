import React, { useState, useEffect } from 'react'
import styled, {css} from 'styled-components'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import {connect} from 'react-redux'
import {getSession} from '../model/session/selectors'
import {notify} from '../util/signal'
import {Button, IconButton} from './Button'
import {ButtonLink} from './ButtonLink'
import {ButtonAnchor} from './ButtonAnchor'

export const MESSAGE = Symbol('MESSAGE')
export const ERROR = Symbol('ERROR')

const StyledList = styled.ol`
  position: fixed;
  top: 2.5rem; // header height
  left: 0;
  z-index: 9;
  display: block;
  width: 100%;
  min-height: 1rem;
  list-style: none;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.3);
  &:empty { box-shadow: none; }
`
const StyledLi = styled.li`
  display: flex;
  width: 100%;
  min-height: 1rem;
  padding: 0.5rem;
  color: white;
  background-color: var(--color-buttonD20);
  span { 
    flex: 1 1 auto;
    align-self: center;
  }
  a:not(${ButtonLink}):not(${ButtonAnchor}) { color: var(--color-buttonL30); }
  &:not(:last-child) {
    box-shadow: 0 -1px 0 var(--color-button) inset;
  }
  ${props => props.notificationType===ERROR && css`
    background-color: var(--color-redD30);
  `}
  ${Button} {
    color: var(--color-not-white);
    margin: 0;
    flex: 0 0 2rem;
    &:hover {
      color: white;
    }
  }
`

export const Notification = connect(
    state => ({ session: getSession(state), state })
  )(() => {

    const [notifications, setNotifications] = useState([])

    function handleNotify(msg){
    	setNotifications([...notifications, notificationFactory(msg)])
    }

    const handleClose = msg=>{
    	setNotifications(notifications.filter(n=>n!==msg))
    }

    useEffect(()=>{
      const binding = notify.add(handleNotify)
      return ::binding.detach
    })

    return <TransitionGroup component={StyledList} data-cy="notifications">
        {notifications.map(notification=><CSSTransition
            timeout={200}
            classNames="anim-li-height"
            key={notification.id}
          >
            <StyledLi notificationType={notification.type}>
              {
                notification?.props?.children
                  &&<span>{notification.props.children}</span>
                  ||(typeof notification.message==='string'&&<span dangerouslySetInnerHTML={{ __html: notification.message }} />)
                  ||<span>{notification.message}</span>
              }
              <IconButton type="close" invert onClick={handleClose.bind(null, notification)}></IconButton>
            </StyledLi>
          </CSSTransition>
        )}
      </TransitionGroup>
})

let id = 0
function notificationFactory(message){
	return Object.assign({
    id: id++
    , message: 'invalid'
    , type: MESSAGE
  }, typeof message === 'string'?{message}:message)
}
