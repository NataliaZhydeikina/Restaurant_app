/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SearchFormService } from './search-form.service';

describe('Service: SearchForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchFormService]
    });
  });

  it('should ...', inject([SearchFormService], (service: SearchFormService) => {
    expect(service).toBeTruthy();
  }));
});
