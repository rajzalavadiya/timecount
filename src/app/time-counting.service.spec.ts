import { TestBed } from '@angular/core/testing';

import { TimeCountingService } from './time-counting.service';

describe('TimeCountingService', () => {
  let service: TimeCountingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeCountingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
