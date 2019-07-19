import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaAnchorButtonComponent } from './sa-anchor-button.component';

describe('SaAnchorButtonComponent', () => {
  let component: SaAnchorButtonComponent;
  let fixture: ComponentFixture<SaAnchorButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaAnchorButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaAnchorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
