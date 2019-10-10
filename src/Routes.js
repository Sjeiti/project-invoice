import React from 'react'
import { Route } from 'react-router-dom'
import { Home } from './views/Home'
import { Overview } from './views/Overview'
import { Clients } from './views/Clients'
import { Client } from './views/Client'
import { Project } from './views/Project'
import { Settings } from './views/Settings'
import { About } from './views/About'
import { Data } from './views/Data'

export const Routes = () => (
  <>
    {[
      [Home, '/']
      , [Overview, '/overview']
      , [Clients, '/clients']
      , [Client, '/client/:client']
      , [Project, '/client/:client/:project']
      , [Settings, '/settings']
      , [Data, '/data']
      , [About, '/about']
    ].map(([component, path], key) => (
      <Route exact key={key} path={path} component={component} />
    ))}
  </>
)
