import {Component, Input, ElementRef} from '@angular/core'
import {ModelService} from '../../model/model.service'

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent {
  @Input()
  amount:number

  constructor(
      private modelService:ModelService,
      private elementRef:ElementRef
  ) {
    elementRef.nativeElement.setAttribute('sign', (modelService.getConfig() as any).currencySign) // todo: don't `as`
  }
}
