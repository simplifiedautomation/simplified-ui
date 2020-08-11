import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaStepperComponent } from './sa-stepper.component';

describe('SaStepperComponent', () => {
  let component: SaStepperComponent;
  let fixture: ComponentFixture<SaStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaStepperComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
