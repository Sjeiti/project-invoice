/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing'
import { RestService } from './rest.service'
import {Http} from '@angular/http'

describe('Service: Rest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestService, Http]
    })
  })

  it('should ...', inject([RestService], (service: RestService) => {
    expect(service).toBeTruthy()
  }))
})
