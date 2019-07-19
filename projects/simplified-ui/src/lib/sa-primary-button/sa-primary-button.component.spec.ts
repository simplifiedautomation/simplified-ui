import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaPrimaryButtonComponent } from './sa-primary-button.component';

describe('SaPrimaryButtonComponent', () => {
  let component: SaPrimaryButtonComponent;
  let fixture: ComponentFixture<SaPrimaryButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaPrimaryButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaPrimaryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
