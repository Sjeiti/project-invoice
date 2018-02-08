import signals from 'signals'

let model, clone, ddeleteModel, redir

export const modelSaved = new signals.Signal()
export const saveable = new signals.Signal()

export function track(element, _model, _clone, _delete) {
  model = _model
  clone = _clone
  ddeleteModel = _delete

  element.addEventListener('change', onModelChange)
  element.addEventListener('click', onModelChange)
  element.addEventListener('keyup', onModelChange)

  function onModelChange(){
    const stringModel = JSON.stringify(_model)
    const stringClone = JSON.stringify(_clone)
    const isSaveable = stringModel!==stringClone;
    saveable.dispatch(isSaveable)
  }
}

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

export function revert() {
  const modelClone = model.clone()
  for (let s in modelClone) {
    if (clone.hasOwnProperty(s)) {
      clone[s] = modelClone[s]
    }
  }
  saveable.dispatch(false)
}

export function deleteModel() {
  ddeleteModel()
}