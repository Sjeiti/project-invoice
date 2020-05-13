import React from 'react'
import marked from 'marked'
import {project as enhanceProject} from '../model/clients/project'
import {interpolate} from '../util'

marked.setOptions({
  renderer: new marked.Renderer()
  , gfm: true
  , tables: true
  , breaks: true
  , pedantic: false
  , sanitize: false
  , smartLists: true
  , smartypants: false
})

export const Parse = ({children, state, values, lang}) => {
  const {copy} = state
  const string = copy.hasOwnProperty(children)&&copy[children][lang]||children

  // enhance project
  values.project = enhanceProject(values.project, {_client:values.client, model:state})

  // reduce copy to lang
  values.copy = Object.entries(copy).reduce((acc, [key, obj])=>{
    acc[key] = obj[lang]
    return acc
  }, {})

  return <span dangerouslySetInnerHTML={{ __html: decode(marked(interpolate(string, values))) }} />
}

function decode(s){
	return s
      .replace(/&#39;/, '\'')
}