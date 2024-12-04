import { TestBed } from '@angular/core/testing';

import { ChildApiService } from './child-api.service';

describe('ChildApiService', () => {
  let service: ChildApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
    service = TestBed.inject(ChildApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
