import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaBaseHeaderComponent } from './sa-base-header.component';

describe('SaBaseHeaderComponent', () => {
  let component: SaBaseHeaderComponent;
  let fixture: ComponentFixture<SaBaseHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaBaseHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaBaseHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
