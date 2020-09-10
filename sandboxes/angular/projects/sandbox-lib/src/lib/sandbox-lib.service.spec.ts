import { TestBed } from '@angular/core/testing';

import { SandboxLibService } from './sandbox-lib.service';

describe('SandboxLibService', () => {
  let service: SandboxLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SandboxLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
