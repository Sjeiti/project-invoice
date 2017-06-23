const Signal = signals.Signal

function signal(...args){
  const signal = new Signal()
  if (args.length) {
    signal.memorize = true
    signal.dispatch.apply(signal, args)
  }
  return signal
}

const
  modelDirty = signal(false),
  modelAction = signal(), // number
  modelAble = signal(), // number
  modelBeforeSave = signal(),
  modelSaved = signal(),
  sassChanged = signal(),
  sassCompiled = signal(),
  cssVariablesChanged = signal()

Object.assign(modelAction, {
  SAVE: 1,
  REVERT: 2,
  DELETE: 4
})

Object.assign(modelAble, {
  SAVE: 1,
  DELETE: 2
})

export {
  modelDirty,
  modelAction,
  modelAble,
  modelBeforeSave,
  modelSaved,
  sassChanged,
  sassCompiled,
  cssVariablesChanged
}