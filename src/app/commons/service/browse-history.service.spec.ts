import { TestBed } from '@angular/core/testing';

import { BrowseHistoryService } from './browse-history.service';

describe('BrowseHistoryService', () => {
  let service: BrowseHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowseHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
