import { TestBed } from '@angular/core/testing';

import { CpInfoService } from './cp-info.service';

describe('CpInfoService', () => {
  let service: CpInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
