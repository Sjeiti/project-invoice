import {Component} from '@angular/core'
import {modelDirty, modelAction, modelAble} from '../../signals'

@Component({
  selector: 'app-saveable-buttons',
  templateUrl: './saveable-buttons.component.html'
})

export class SaveableButtonsComponent {

  isDeletable = false
  isSaveable = false
  isModelDirty = false

  constructor() {
    modelDirty.add(dirty=>{this.isModelDirty = dirty})
    modelAble.add(abilities=>{
      this.isDeletable = !!(modelAble.DELETE&abilities)
      this.isSaveable = !!(modelAble.SAVE&abilities)
    })
  }

  onSave(){ modelAction.dispatch(modelAction.SAVE) }

  onRevert(){ modelAction.dispatch(modelAction.REVERT) }

  onDelete(){ modelAction.dispatch(modelAction.DELETE) }
}
