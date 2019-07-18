import { TestBed } from '@angular/core/testing';

import { SimplifiedUiService } from './simplified-ui.service';

describe('SimplifiedUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimplifiedUiService = TestBed.get(SimplifiedUiService);
    expect(service).toBeTruthy();
  });
});
