import {signal} from '@/signals'

let model, clone, deleteCallback

export const modelSaved = signal()
export const saveable = signal()
export const tracked = signal()

const boundListeners = [];

/**
 * Add eventlisteners and store the bindings for later removal
 * @param {HTMLElement} eventTarget
 * @param {string} event
 * @param {Function} listener
 * @param {boolean|object} options
 */
function addEventListener(eventTarget, event, listener, options) {
    boundListeners.push({ eventTarget, event, listener });
    eventTarget.addEventListener(event, listener, options);
}

/**
 * Remove all stored event listeners
 */
function removeEventListeners(){
	 boundListeners.forEach(({ eventTarget, event, listener }) => eventTarget.removeEventListener(event, listener));
	 boundListeners.length = 0
}

/**
 * Track change to an element to trigger diff detection between a model and its clone
 * @param {HTMLElement} element The element the change event is bound to
 * @param {object} _model
 * @param {Function} _delete
 * @returns {object} The cloned model
 */
export function track(element, _model, _delete) {
  model = _model
  clone = _model.clone()
  deleteCallback = _delete

  removeEventListeners()

  // ['change','click','keyup'].forEach(s=>addEventListener(element, s, onModelChange, true))
  addEventListener(element, 'change', onModelChange, true)
  addEventListener(element, 'click', onModelChange, true)
  addEventListener(element, 'keyup', onModelChange, true)

  function onModelChange(){
    const stringModel = JSON.stringify(model)
    const stringClone = JSON.stringify(clone)
    const isSaveable = stringModel!==stringClone;
    saveable.dispatch(isSaveable)
  }
  tracked.dispatch(true,!!deleteCallback)

  return clone
}

/**
 * Apply the clone to the model and dispatch a save signal
 */
export function untrack() {
  removeEventListeners()
  tracked.dispatch(false)
}

/**
 * Apply the clone to the model and dispatch a save signal
 */
export function save() {
  const cloneClone = clone.clone()
  for (let s in cloneClone) {
    if (model.hasOwnProperty(s)) {
      model[s] = cloneClone[s]
    }
  }
  modelSaved.dispatch()
  saveable.dispatch(false)
}

/**
 * Apply the model to the clone and dispatch the saveable signal
 */
export function revert() {
  const modelClone = model.clone()
  for (let s in modelClone) {
    if (clone.hasOwnProperty(s)) {
      clone[s] = modelClone[s]
    }
  }
  saveable.dispatch(false)
}

/**
 * Call the delete method
 */
export function deleteModel() {
  deleteCallback&&deleteCallback()
}