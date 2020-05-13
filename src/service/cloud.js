import {store} from '../model/store'
import {cloudRead} from '../model/middleWare/storeCloud'
import {tryParse} from '../util'
import {restoreState} from '../model/rootActions'
import {notify} from '../util/signal'
import {ERROR} from '../components/Notification'

export function getCloud() {
  const state = store.getState()
  const {config: {cloudSelected}} = state
  const dispatchError = ()=>notify.dispatch({
    message: 'cloud read fail'
    , type: ERROR
  })
  cloudSelected && cloudRead(cloudSelected)
      .then(
          data=>{
            const json = data && tryParse(data)
            if (json) {
              const isNewer = json.timestamp>state.timestamp
              isNewer&&store.dispatch(restoreState(json))
            } else {
              dispatchError()
            }
          }
          , dispatchError
      )
}
