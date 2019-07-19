import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaTableOfContentsComponent } from './sa-table-of-contents.component';

describe('SaTableOfContentsComponent', () => {
  let component: SaTableOfContentsComponent;
  let fixture: ComponentFixture<SaTableOfContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaTableOfContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaTableOfContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
