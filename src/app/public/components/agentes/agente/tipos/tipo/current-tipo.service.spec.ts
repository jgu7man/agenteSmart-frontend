import { TestBed } from '@angular/core/testing';

import { CurrentTipoService } from './current-tipo.service';

describe('CurrentTipoService', () => {
  let service: CurrentTipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentTipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
