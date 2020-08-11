import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaTextEditorComponent } from './sa-text-editor.component';

describe('SaTextEditorComponent', () => {
  let component: SaTextEditorComponent;
  let fixture: ComponentFixture<SaTextEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaTextEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
