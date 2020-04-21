import React, {useState, useCallback} from 'react'
import styled from 'styled-components'
import {moveArrayItem} from '../util'

const initialDnDState = {
  draggedFrom: null
  , draggedTo: null
  , isDragging: false
  , originalOrder: []
  , updatedOrder: []
}

export const Tr = styled.tr``

export function useDraggable(subjects) {
  const [list, setList] = useState( subjects )
  const [dragAndDrop, setDragAndDrop] = useState( initialDnDState )
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

  const onDragStart = e=>{
    if (isValid) {
      const initialPosition = Number(e.currentTarget.dataset.position)
      setDragAndDrop({
        ...dragAndDrop
        , draggedFrom: initialPosition
        , isDragging: true
        , originalOrder: list
      })
      e.dataTransfer.setData('text/html', '') // firefox fix
    }
  }
  const onDragOver = e=>{
    e.preventDefault()
    const {draggedFrom, draggedTo, originalOrder} = dragAndDrop
    if (draggedFrom!==null) {
      const draggedToNew = Number(e.currentTarget.dataset.position)
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
    dragged(dragAndDrop.draggedFrom, dragAndDrop.draggedTo)
    if (draggedFrom!==null) {
      setList(dragAndDrop.updatedOrder)
      setDragAndDrop({
       ...dragAndDrop
       , draggedFrom: null
       , draggedTo: null
       , isDragging: false
      })
    }
  }
 const onDragLeave = () => {
   setDragAndDrop({
     ...dragAndDrop
     , draggedTo: null
   })
 }

  const rowAttr = {
    draggable: 'true'
    , onMouseDown
    , onDragStart
    , onDragOver
    , onDrop
    , onDragLeave
  }

  return <Elm {...rowAttr} {...attr} />
}