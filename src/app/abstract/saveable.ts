import {OnInit, OnDestroy} from '@angular/core'
import {ModelService} from '../model/model.service'
// import {Observer} from 'rxjs'
import {modelDirty, modelAction, modelAble} from '../signals'

export class Saveable implements OnInit, OnDestroy {

  private modelSaved:any
  private changedTimeout = 0
  private model:any
  private boundKeyhandler:EventListenerObject
  public isModelDirty = false

  static enable(state:number) {
    modelAble.dispatch(state)
  }

  constructor(
      protected modelService:ModelService,
      abilities = modelAble.SAVE
  ) {
    modelAble.dispatch(abilities)
  }

  ngOnInit(){
    this.boundKeyhandler = this.onKey.bind(this)
    document.addEventListener('keydown', this.boundKeyhandler)
    modelAction.add(action=>{
      action===modelAction.SAVE&&this.onSave()||
      action===modelAction.REVERT&&this.onRevert()
    })
  }

  ngOnDestroy(){
    document.removeEventListener('keydown', this.boundKeyhandler)
    modelAction.removeAll()
    modelDirty.dispatch(false)
    modelAble.dispatch()
  }

  protected setModel(model:any):any {
    this.modelSaved = model
    return this.cloneModel()
  }

  onSave() {
    if (this.isObjectLiteral(this.model)&&this.isObjectLiteral(this.modelSaved)) {
      for (let prop in this.modelSaved) {
        if (!this.model.hasOwnProperty(prop)) {
          delete this.modelSaved[prop]
        }
      }
    }
    Object.assign(this.modelSaved, this.model)
    this.modelService.save()
    this.cloneModel()
    this.checkModelDirty()
  }

  onRevert():any {
    this.cloneModel()
    this.checkModelDirty()
    return this.model
  }

  onNgModelChanged() {
    window.clearTimeout(this.changedTimeout)
    this.changedTimeout = window.setTimeout(this.checkModelDirty.bind(this), 200)
  }

  protected onDelete(deleteMethod:(n:any) => boolean):boolean {
    return confirm('Are you sure to delete this?')&&deleteMethod(this.modelSaved) // todo: msg from config
  }

  onKey(e){
    // this.isModelDirty&&e.key==='s'&&e.ctrlKey&&(this.onSave()||e.preventDefault())
    this.isModelDirty&&e.key==='s'&&e.ctrlKey&&(modelAction.dispatch(modelAction.SAVE)||e.preventDefault())
  }

  protected checkModelDirty() {
    this.isModelDirty = !_.isEqual(this.model, this.modelSaved)
    modelDirty.dispatch(this.isModelDirty)
    // this.modelService.setDirty(this.isModelDirty)
  }

  protected cloneModel():any {
    this.model = _.cloneDeep(this.modelSaved)
    return this.model
  }

  private isObjectLiteral(o:any):boolean{
    return o instanceof Object && o.constructor===Object
  }

}
