import { TestBed } from '@angular/core/testing';

import { HistoryStagesService } from './history-stages.service';

describe('HistoryStagesService', () => {
  let service: HistoryStagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryStagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
