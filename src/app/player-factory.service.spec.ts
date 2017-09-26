import { TestBed, inject } from '@angular/core/testing';

import { PlayerFactoryService } from './player-factory.service';

describe('PlayerFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerFactoryService]
    });
  });

  it('should be created', inject([PlayerFactoryService], (service: PlayerFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
