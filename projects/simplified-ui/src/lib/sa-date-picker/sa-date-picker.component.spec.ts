import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaDatePickerComponent } from './sa-date-picker.component';

describe('SaDatePickerComponent', () => {
  let component: SaDatePickerComponent;
  let fixture: ComponentFixture<SaDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaDatePickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
