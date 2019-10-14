export const logger = store => next => action => {
  const result = next(action)
  console.log('stateChange', action, store.getState())
  return result
}