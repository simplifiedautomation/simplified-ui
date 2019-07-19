import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaHeaderComponent } from './sa-header.component';

describe('SaHeaderComponent', () => {
  let component: SaHeaderComponent;
  let fixture: ComponentFixture<SaHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
