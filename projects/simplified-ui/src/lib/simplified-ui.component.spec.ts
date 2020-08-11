import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplifiedUiComponent } from './simplified-ui.component';

describe('SimplifiedUiComponent', () => {
  let component: SimplifiedUiComponent;
  let fixture: ComponentFixture<SimplifiedUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimplifiedUiComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplifiedUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
