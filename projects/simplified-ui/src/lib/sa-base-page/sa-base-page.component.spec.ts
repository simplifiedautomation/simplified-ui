import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaBasePageComponent } from './sa-base-page.component';

describe('SaBasePageComponent', () => {
  let component: SaBasePageComponent;
  let fixture: ComponentFixture<SaBasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaBasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaBasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
