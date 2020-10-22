import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaPageHeaderComponent } from './sa-page-header.component';

describe('SaPageHeaderComponent', () => {
  let component: SaPageHeaderComponent;
  let fixture: ComponentFixture<SaPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaPageHeaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
