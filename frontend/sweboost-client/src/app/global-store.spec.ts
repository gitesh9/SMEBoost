import { TestBed } from '@angular/core/testing';

import { GlobalStore } from './global-store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GlobalStore', () => {
  let service: GlobalStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(GlobalStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
