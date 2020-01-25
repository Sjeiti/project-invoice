import {store} from '../model/store'
import {cloudRead} from '../model/middleWare/storeCloud'
import {tryParse} from '../util'
import {restoreState} from '../model/rootActions'
import {notify} from '../util/signal'

export function getCloud() {
  // grab current state
  const state = store.getState()
  const {config: {cloudSelected}} = state
  cloudSelected && cloudRead(cloudSelected)
        .then(
            data=>{
              const json = data && tryParse(data)
              if (json) {
                store.dispatch(restoreState(json))
                // todo store correctly updated but components not rerendering
              } else {
                notify.dispatch('cloud read fail') // todo duplicate
              }
            }
            ,notify.dispatch.bind(notify, 'cloud read fail') // todo duplicate
        )
}