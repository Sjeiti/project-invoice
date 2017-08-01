import {PipeTransform, Pipe} from '@angular/core'
import {DomSanitizer} from '@angular/platform-browser'

@Pipe({
  name: 'safeHtml'
})
/**
 * Pipe for sanitising html
 * @example
<div *ngIf="isQuotation" [innerHTML]="parse(project.quotationBefore) | safeHtml" class="wrapper"></div>
 */
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value)
  }
}
