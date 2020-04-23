import { Component, OnDestroy, HostBinding, Input, ElementRef, OnInit, ViewChild, EventEmitter, Output, forwardRef, Injector, DoCheck, Renderer2, AfterViewInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatFormFieldControl } from '@angular/material';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import * as Quill from 'node_modules/quill/dist/quill.js';

@Component({
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  },
  selector: 'sa-text-editor',
  templateUrl: './sa-text-editor.component.html',
  styleUrls: ['./sa-text-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SaTextEditorComponent),
    multi: true
  },
  {
    provide: MatFormFieldControl,
    useExisting: SaTextEditorComponent
  }
  ]
})
export class SaTextEditorComponent implements AfterViewInit, MatFormFieldControl<any>, ControlValueAccessor, OnDestroy, DoCheck, OnInit {

  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  @Output() changed: EventEmitter<any> = new EventEmitter();

  quill: any = Quill;
  editorElem: HTMLElement | undefined

  editor: any;

  controlType = 'texteditor';

  errorState = false;

  _value: any;

  stateChanges = new Subject<void>();

  static nextId = 0;
  @HostBinding() id = `text-editor-input-${SaTextEditorComponent.nextId++}`;
  ngControl: any;
  focused: boolean;
  touched: boolean;

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'div') {
      this.container.nativeElement.querySelector('div').focus();
    }
  }

  constructor(public elementRef: ElementRef, private renderer: Renderer2,
    public injector: Injector, fm: FocusMonitor) {
    
    fm.monitor(elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }
  ngAfterViewInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement.querySelector('.ql-editor'), 'notranslate');
  }

  get value(): any {
    return this._value;
  }
  set value(value) {
    this.elementRef.nativeElement.querySelector('.ql-editor').innerHTML = value;
    
    this.onChange(value);
    this.stateChanges.next();
  }
  get empty() {
    const commentText = this.editor.getText().trim();
    return commentText ? false : true;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return true;
  }

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  public _placeholder: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  public _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  public _disabled = false;


  ngOnInit(): void {

    var toolbarOptions = [
      'bold', 'italic', 'underline', 'strike', 'blockquote', { 'list': 'ordered' }, { 'list': 'bullet' },
      { 'script': 'sub' }, { 'script': 'super' }, { 'indent': '-1' }, { 'indent': '+1' },
      { 'header': [1, 2, 3, 4, 5, 6, false] }, { 'color': [] }, { 'background': [] }, { 'font': [] }, { 'align': [] }, 'link', 'image', 'video'
    ];

    this.ngControl = this.injector.get(NgControl);
    this.elementRef.nativeElement.parentElement.setAttribute("style", "padding-top: 0em");
    if (this.ngControl != null) { this.ngControl.valueAccessor = this; }

    let editor = this.container.nativeElement.
      querySelector('#editor')
    this.editor = new Quill(editor, {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });
    this.editor.on('editor-change', (eventName, ...args) => {

      let html: string | null = this.editorElem.querySelector('.ql-editor').innerHTML;
      if (html === '<p><br></p>' || html === '<div><br><div>' || html === '<p></p>') {
        html = null
      }
      this.onChange(html);
      this.changed.emit({
        value: html,
        text: this.editor.getText()
      });
    })
  }


  ngOnChanges() {
    if (this.editor) {
      this.elementRef.nativeElement.querySelector('.ql-editor').innerHTML = this.value;
    }
  }

  onChange = (delta: any) => { };

  onTouched = () => {
    this.touched = true;
  };

  writeValue(data: any): void {
    this.elementRef.nativeElement.querySelector('.ql-editor').innerHTML = data;
    this._value = data;
  }

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }
  ngAfterContentInit() {
    this.editorElem = this.elementRef.nativeElement;
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      let isWhitespace = false;
      if (this._required){
        isWhitespace = this.getTextFromHtml(this.ngControl.value).trim().length === 0;
      }
      this.errorState = (isWhitespace || this.ngControl.invalid) && this.ngControl.touched ;
      if(this.ngControl.control){
        if (this.errorState)
          this.ngControl.control.setErrors({required: true});
        else
          this.ngControl.control.setErrors(null);
      }
      this.stateChanges.next();
    }
  }

  private getTextFromHtml(html: string): string{
    var htmlDocumentBody = document.implementation.createHTMLDocument("New").body;
    htmlDocumentBody.innerHTML = html;
    return htmlDocumentBody.textContent || htmlDocumentBody.innerText || "";
  }

}
