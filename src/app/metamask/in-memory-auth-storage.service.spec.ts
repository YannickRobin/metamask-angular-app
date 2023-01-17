import { TestBed } from '@angular/core/testing';

import { InMemoryAuthStorageService } from './in-memory-auth-storage.service';

describe('InMemoryAuthStorageService', () => {
  let service: InMemoryAuthStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryAuthStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
