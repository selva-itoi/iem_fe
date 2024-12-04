import { TestBed } from '@angular/core/testing';

import { ChurchApiService } from './church-api.service';

describe('ChurchApiService', () => {
  let service: ChurchApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
    service = TestBed.inject(ChurchApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
