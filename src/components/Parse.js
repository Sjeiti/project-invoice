import React from 'react'
import marked from 'marked'
import {project as enhanceProject} from '../model/clients/project'

marked.setOptions({
  renderer: new marked.Renderer()
  , gfm: true
  , tables: true
  , breaks: true // false,
  , pedantic: false
  , sanitize: false
  , smartLists: true
  , smartypants: false
})

export const Parse = ({children, state, project:_project, client, invoice, lang}) => {
  const {personal:data, copy} = state
  const string = copy.hasOwnProperty(children)&&copy[children][lang]||children

  const project = enhanceProject(_project, {_client:client, model:state})

  const params = {data, project, client, invoice, lang}
  const stringParams = Object.keys(params)
  const arrayParams = Object.values(params)

  const parsed =  (new Function(...stringParams, 'return `'+string+'`'))(...arrayParams)

  // copy.includes(children)&&copy[children][lang]||
  return <>{marked(parsed)}</>
}


