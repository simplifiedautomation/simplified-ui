import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaNavigablePageComponent } from './sa-navigable-page.component';

describe('SaNavigablePageComponent', () => {
  let component: SaNavigablePageComponent;
  let fixture: ComponentFixture<SaNavigablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaNavigablePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaNavigablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
