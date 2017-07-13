import {OnInit, OnDestroy} from '@angular/core'
import {ModelService} from '../model/model.service'
import {modelDirty, modelAction, modelAble} from '../signals'

/**
 * Saveable is a base-class for pages that handle saving a model
 */
export class Saveable implements OnInit, OnDestroy {

  private modelSaved:any
  private changedTimeout = 0
  private model:any
  private boundKeyhandler:EventListenerObject
  public isModelDirty = false

  static enable(state:number) {
    modelAble.dispatch(state)
  }

  /**
   * Constructor
   * Dispatches abilities so buttons can be shown or hidden
   * @param {ModelService} modelService
   * @param {number} abilities
   */
  constructor(
      protected modelService:ModelService,
      abilities = modelAble.SAVE
  ) {
    // modelAble.dispatch(abilities)
    Saveable.enable(abilities)
  }

  /**
   * Add event listeners on init
   */
  ngOnInit(){
    this.boundKeyhandler = this.onKey.bind(this)
    document.addEventListener('keydown', this.boundKeyhandler)
    modelAction.add(action=>{
      action===modelAction.SAVE&&this.onSave()||
      action===modelAction.REVERT&&this.onRevert()
    })
  }

  /**
   * Remove event listeners on destroy
   */
  ngOnDestroy(){
    document.removeEventListener('keydown', this.boundKeyhandler)
    modelAction.removeAll()
    modelDirty.dispatch(false)
    modelAble.dispatch()
  }

  /**
   * Sets the model and clones it
   * @param {any} model
   * @returns {any}
   */
  protected setModel(model:any):any {
    this.modelSaved = model
    return this.cloneModel()
  }

  /**
   * Save event handler
   */
  onSave() {
    // delete unset properties
    if (this.isObjectLiteral(this.model)&&this.isObjectLiteral(this.modelSaved)) {
      for (let prop in this.modelSaved) {
        if (!this.model.hasOwnProperty(prop)) {
          delete this.modelSaved[prop]
        }
      }
    }
    // copy clone to actual model
    Object.assign(this.modelSaved, this.model)
    //
    this.modelService.save()
    // reset state
    this.cloneModel()
    this.checkModelDirty()
  }

  /**
   * Revert model to original state
   * @returns {any}
   */
  onRevert():any {
    this.cloneModel()
    this.checkModelDirty()
    return this.model
  }

  /**
   * Possibly change state when model changes
   */
  onNgModelChanged() {
    window.clearTimeout(this.changedTimeout)
    this.changedTimeout = window.setTimeout(this.checkModelDirty.bind(this), 200)
  }

  /**
   * Delete model
   * @param {Function} deleteMethod
   * @returns {boolean}
   */
  protected onDelete(deleteMethod:(n:any) => boolean):boolean {
    return confirm('Are you sure to delete this?')&&deleteMethod(this.modelSaved) // todo: msg from config
  }

  /**
   * Handle key event for CTRL-s
   * @param {KeyboardEvent} e
   */
  onKey(e){
    this.isModelDirty&&e.key==='s'&&e.ctrlKey&&(modelAction.dispatch(modelAction.SAVE)||e.preventDefault())
  }

  /**
   * Test if the cloned model equals the original model and dispatches the result
   */
  protected checkModelDirty() {
    this.isModelDirty = !_.isEqual(this.model, this.modelSaved)
    modelDirty.dispatch(this.isModelDirty)
  }

  /**
   * Crete a clone
   * @returns {any}
   */
  protected cloneModel():any {
    this.model = _.cloneDeep(this.modelSaved)
    return this.model
  }

  /**
   * Test to see if an object is an object-literal
   * @param {object} o
   * @returns {boolean}
   */
  private isObjectLiteral(o:any):boolean{
    return o instanceof Object && o.constructor===Object
  }

}
