/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { SaveableButtonsComponent } from './saveable-buttons.component'

describe('SaveableButtonsComponent', () => {
  let component: SaveableButtonsComponent
  let fixture: ComponentFixture<SaveableButtonsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveableButtonsComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveableButtonsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
