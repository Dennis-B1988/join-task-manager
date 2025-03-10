import { TestBed } from '@angular/core/testing';

import { UnsubscripeService } from './unsubscripe.service';

describe('UnsubscripeService', () => {
  let service: UnsubscripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsubscripeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
