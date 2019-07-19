import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaButtonComponent } from './sa-button.component';

describe('SaButtonComponent', () => {
  let component: SaButtonComponent;
  let fixture: ComponentFixture<SaButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
