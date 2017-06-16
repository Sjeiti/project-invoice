/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing'
import { LocalisationService } from './localisation.service'

describe('Service: Localisation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalisationService]
    })
  })

  it('should ...', inject([LocalisationService], (service: LocalisationService) => {
    expect(service).toBeTruthy()
  }))
})
