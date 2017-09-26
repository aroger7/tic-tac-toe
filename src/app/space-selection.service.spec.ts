import { TestBed, inject } from '@angular/core/testing';

import { SpaceSelectionService } from './space-selection.service';

describe('SpaceSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpaceSelectionService]
    });
  });

  it('should be created', inject([SpaceSelectionService], (service: SpaceSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
