import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaCurrencyInputComponent } from './sa-currency-input.component';

describe('SaCurrencyInputComponent', () => {
  let component: SaCurrencyInputComponent;
  let fixture: ComponentFixture<SaCurrencyInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaCurrencyInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaCurrencyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
