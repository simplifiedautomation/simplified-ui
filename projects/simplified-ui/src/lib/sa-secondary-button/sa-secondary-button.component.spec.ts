import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaSecondaryButtonComponent } from './sa-secondary-button.component';

describe('SaSecondaryButtonComponent', () => {
  let component: SaSecondaryButtonComponent;
  let fixture: ComponentFixture<SaSecondaryButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaSecondaryButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaSecondaryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
