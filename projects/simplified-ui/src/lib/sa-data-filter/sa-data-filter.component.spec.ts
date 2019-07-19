import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaDataFilterComponent } from './sa-data-filter.component';

describe('SaDataFilterComponent', () => {
  let component: SaDataFilterComponent;
  let fixture: ComponentFixture<SaDataFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaDataFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaDataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
