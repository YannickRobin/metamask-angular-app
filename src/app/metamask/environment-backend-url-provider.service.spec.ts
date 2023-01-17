import { TestBed } from '@angular/core/testing';

import { EnvironmentBackendUrlProviderService } from './environment-backend-url-provider.service';

describe('EnvironmentBackendUrlProviderService', () => {
  let service: EnvironmentBackendUrlProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentBackendUrlProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
