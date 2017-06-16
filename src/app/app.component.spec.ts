/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing'
import {AppComponent} from './app.component'
import {HeaderComponent} from './component/header/header.component'
import {FooterComponent} from './component/footer/footer.component'
import {SaveableButtonsComponent} from './component/saveable-buttons/saveable-buttons.component'
// import {RouterOutlet} from '@angular/router'
import {FormsModule} from '@angular/forms'
import {RouterTestingModule} from '@angular/router/testing'
import {DOMHeadService} from './service/dom.head.service'

describe('App: Rekeningen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
          HeaderComponent,
          FooterComponent,
          // RouterOutlet,
          SaveableButtonsComponent
      ],
      imports: [ FormsModule, RouterTestingModule ]
    })
  })

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent)
    let app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))

  /*it(`should have as title 'app works!'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent)
    let app = fixture.debugElement.componentInstance
    expect(app.title).toEqual('app works!')
  }))

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    let compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('app works!')
  }))*/
})
