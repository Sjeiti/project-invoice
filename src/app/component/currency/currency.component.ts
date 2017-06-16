import {Component, Input, ElementRef} from '@angular/core'

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent {
  @Input()
  amount:number

  constructor(private elementRef:ElementRef) {
    elementRef.nativeElement.setAttribute('sign', '€')
  }
}
