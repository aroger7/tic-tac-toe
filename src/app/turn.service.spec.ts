import { TestBed, inject } from '@angular/core/testing';

import { TurnService } from './turn.service';

describe('TurnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnService]
    });
  });

  it('should be created', inject([TurnService], (service: TurnService) => {
    expect(service).toBeTruthy();
  }));
});
