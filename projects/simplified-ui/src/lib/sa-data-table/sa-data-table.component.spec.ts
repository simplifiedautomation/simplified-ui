import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaDataTableComponent } from './sa-data-table.component';

describe('SaDataTableComponent', () => {
  let component: SaDataTableComponent;
  let fixture: ComponentFixture<SaDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
