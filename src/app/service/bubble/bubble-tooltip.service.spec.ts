import { TestBed } from '@angular/core/testing';

import { BubbleTooltipService } from './bubble-tooltip.service';

describe('BubbleTooltipService', () => {
  let service: BubbleTooltipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BubbleTooltipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
