/* tslint:disable:no-unused-variable */

import {DomSanitizer} from '@angular/platform-browser'
import {TestBed, async} from '@angular/core/testing'
import {SafeHtmlPipe} from './safe-html.pipe'

describe('Pipe: SafeHTML', ()=> {
  it('create an instance', ()=> {
    let pipe = new SafeHtmlPipe(<DomSanitizer>{})
    expect(pipe).toBeTruthy()
  })
})
