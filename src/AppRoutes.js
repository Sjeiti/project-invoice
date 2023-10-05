import React from 'react'
import {Routes, Route} from 'react-router-dom'
import {Home} from './views/Home'
import {Overview} from './views/Overview'
import {Clients} from './views/Clients'
import {Client} from './views/Client'
import {Project} from './views/Project'
import {Settings} from './views/Settings'
import {About} from './views/About'
import {Layout} from './views/Layout'
import {Data} from './views/Data'
import {Copy} from './views/Copy'
import {Invoice} from './views/Invoice'
import {Changelog} from './views/Changelog'
import {Test} from './views/Test'

export const AppRoutes = () => (
  <Routes>
    {[
      [Home, '/']
      , [Overview, '/overview']
      , [Overview, '/overview/:year']
      , [Clients, '/clients']
      , [Client, '/client/:client']
      , [Project, '/client/:client/:project']
      , [Invoice, '/client/:client/:project/quotation']
      , [Invoice, '/client/:client/:project/invoice']
      , [Invoice, '/client/:client/:project/reminder/:reminder']
      , [Settings, '/settings']
      , [Data, '/data']
      , [Copy, '/copy']
      , [About, '/about']
      , [Layout, '/layout']
      , [Changelog, '/changelog']
      , [Test, '/test']
    ].map(([Component, path], key) => (
      // <Route exact key={key} path={path} component={component} />
      <Route exact key={key} path={path} element={<Component/>} />
    ))}
  </Routes>
)
