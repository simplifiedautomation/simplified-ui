import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaMoreMenuComponent } from './sa-more-menu.component';

describe('SaMoreMenuComponent', () => {
  let component: SaMoreMenuComponent;
  let fixture: ComponentFixture<SaMoreMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaMoreMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaMoreMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
