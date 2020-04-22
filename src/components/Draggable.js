import React, {useState, useCallback, useRef} from 'react'
import classNames from 'classnames'
import styled from 'styled-components'
import {moveArrayItem} from '../util'

const initialState = {
  draggedFrom: null
  , draggedTo: null
  , isDragging: false
  , originalOrder: []
  , updatedOrder: []
}

export const Tr = styled.tr``

export function useDraggable(subjects) {
  const [list, setList] = useState( subjects )
  const [dragAndDrop, setDragAndDrop] = useState( initialState )
  return {list, setList, dragAndDrop, setDragAndDrop}
}

export const Draggable = ({
  elm
  , list
  , setList
  , dragAndDrop
  , setDragAndDrop
  , dragSelector
  , dragged
  , ...attr
}) => {

  const Elm = elm||Tr

  const [isValid, setValid] = useState(false)

  const onMouseDown = useCallback(({target}) => {
    setValid(!dragSelector||target.matches(dragSelector))
  }, [])

  const {draggedFrom, draggedTo} = dragAndDrop
  const pos = parseInt(attr['data-position'], 10)

  const onDragStart = e=>{
    if (isValid) {
      const {currentTarget} = e
      const initialPosition = Number(currentTarget.dataset.position)
      setDragAndDrop({
        ...dragAndDrop
        , draggedFrom: initialPosition
        , isDragging: true
        , originalOrder: list
      })
    } else {
      e.preventDefault()
    }
  }

  const onDragOver = e=>{
    e.preventDefault()
    const {draggedFrom, draggedTo, originalOrder} = dragAndDrop
    if (draggedFrom!==null) {
      const {currentTarget} = e
      const draggedToNew = Number(currentTarget.dataset.position)
      const newList = moveArrayItem(originalOrder, draggedFrom, draggedToNew)
      if (draggedToNew!==draggedTo) {
        setDragAndDrop({
          ...dragAndDrop
          , updatedOrder: newList
          , draggedTo: draggedToNew
        })
      }
    }
  }

  const onDrop = ()=>{
    const {draggedFrom} = dragAndDrop
    if (draggedFrom!==null) {
      dragged
        ?dragged(dragAndDrop.draggedFrom, dragAndDrop.draggedTo)
        :setList(dragAndDrop.updatedOrder)
      setDragAndDrop({
       ...dragAndDrop
       , draggedFrom: null
       , draggedTo: null
       , isDragging: false
      })
      setValid(false)
    }
  }

  const onDragLeave = () => {
    setDragAndDrop({
      ...dragAndDrop
      , draggedTo: null
    })
  }

  const rowAttr = {
    draggable: isValid?'true':'false'
    , onMouseDown
    , onDragStart
    , onDragOver
    , onDrop
    , onDragLeave
  }

  return <Elm {...rowAttr} {...attr} className={classNames({
    dragFrom:pos===draggedFrom
    , dragTo:pos===draggedTo
  })} />
}