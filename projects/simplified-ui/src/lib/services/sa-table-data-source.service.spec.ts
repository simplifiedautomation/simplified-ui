import { TestBed } from '@angular/core/testing';

import { SaTableDataSourceService } from './sa-table-data-source.service';

describe('SaTableDataSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaTableDataSourceService = TestBed.get(SaTableDataSourceService);
    expect(service).toBeTruthy();
  });
});
