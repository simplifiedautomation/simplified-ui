import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaSelectComponent } from './sa-select.component';

describe('SaSelectComponent', () => {
  let component: SaSelectComponent;
  let fixture: ComponentFixture<SaSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
