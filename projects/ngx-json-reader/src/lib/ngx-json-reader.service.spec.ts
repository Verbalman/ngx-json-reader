import { TestBed } from '@angular/core/testing';

import { NgxJsonReaderService } from './ngx-json-reader.service';

describe('NgxJsonReaderService', () => {
  let service: NgxJsonReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxJsonReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
