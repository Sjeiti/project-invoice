/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing'
import {ModelService} from './model.service'
import {RestService} from '../service/rest.service'

describe('Service: Model', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelService, RestService]
    })
  })

  it('should ...', inject([ModelService], (service: ModelService) => {
    expect(service).toBeTruthy()
  }))
})
