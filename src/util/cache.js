/* eslint-disable no-console */

import {register} from 'register-service-worker'
import {signal} from './signal'
import {VERSION} from '../config'

export const appReady = signal()
export const appCached = signal()
export const appUpdated = signal()
export const appOffline = signal()
export const appError = signal()

const updatedKey = 'appUpdated'

if (localStorage.getItem(updatedKey)){
  console.log(`Project Invoice has just been updated to version ${VERSION}`)
  localStorage.removeItem(updatedKey)
} else {
  appUpdated.add(()=>{
    localStorage.setItem(updatedKey, '1')
    caches.keys().then(cacheNames => cacheNames.forEach(cacheName => caches.delete(cacheName)))
    location.reload()
  })
}

if (process.env.NODE_ENV==='production') {
  register('/service-worker.js', Object.entries({
    ready: [appReady, 'App is being served from cache by a service worker']
    , cached: [appCached, 'Content has been cached for offline use']
    , updated: [appUpdated, 'New content is available; please refresh']
    , offline: [appOffline, 'No internet connection found. App is running in offline mode.']
    , error: [appError, 'Error during service worker registration']
  }).reduce((acc, [key, [signal, msg]])=>{
    acc[key] = (...arg) => {
      console.log(`cache: ${key}`, ...arg)
      signal.dispatch(...arg)
    }
    return acc
  }, {}))
}
