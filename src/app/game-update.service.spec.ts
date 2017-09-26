import { TestBed, inject } from '@angular/core/testing';

import { GameUpdateService } from './game-update.service';

describe('GameUpdateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameUpdateService]
    });
  });

  it('should be created', inject([GameUpdateService], (service: GameUpdateService) => {
    expect(service).toBeTruthy();
  }));
});
