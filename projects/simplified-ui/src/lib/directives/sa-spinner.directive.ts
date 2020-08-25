import { Directive, Input, ElementRef, Renderer2, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector: '[saSpinner]'
})
export class SaSpinnerDirective {
  private _isSpinning: boolean = false;
  @Input('saSpinner')
  set isSpinning(val: boolean) {
    this._isSpinning = val;
    this.updateSpinner();
  }

  private _backgroundColor: string;
  @Input()
  set backgroundColor(val: string) {
    this._backgroundColor = val;
    this.updateSpinner();
  }

  private _diameter: number;
  @Input()
  set diameter(val: number) {
    this._diameter = val;
    this.updateSpinner();
  }

  private _opacity: string;
  @Input()
  set opacity(val: string) {
    this._opacity = val;
    this.updateSpinner();
  }

  private parentDiv: any;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  private updateSpinner() {
    if (this._isSpinning) {
      this.removeSpinner();
      this.addSpinner();
    } else {
      this.removeSpinner();
    }
  }

  private addSpinner() {
    // Create Mat-Spinner
    const factory = this.componentFactoryResolver.resolveComponentFactory(MatProgressSpinner);
    const spinner = this.viewContainerRef.createComponent(factory);
    spinner.instance.diameter = this._diameter || 35;
    spinner.instance.mode = 'indeterminate';
    let spinnerElement = spinner.injector.get(MatProgressSpinner)._elementRef.nativeElement;
    spinnerElement.style.position = 'absolute';
    spinnerElement.style.zIndex = '10';

    // The host element must be relatively positioned to use the directive
    this.el.nativeElement.style.position = 'relative';

    // Create a parent div to hold transparency and mat-spinner
    this.parentDiv = this.renderer.createElement('div');
    this.parentDiv.style.width = '100%';
    this.parentDiv.style.height = '100%';
    this.parentDiv.style.position = 'absolute';
    this.parentDiv.style.top = '0px';
    this.parentDiv.style.left = '0px';
    this.parentDiv.style.display = 'flex';
    this.parentDiv.style.justifyContent = 'center';
    this.parentDiv.style.alignItems = 'center';
    this.renderer.addClass(this.parentDiv, 'saSpinner-parent');

    // Create a transclucent background to show spinner on.
    var newDiv = this.renderer.createElement('div');
    newDiv.style.width = '100%';
    newDiv.style.height = '100%';
    newDiv.style.backgroundColor = this._backgroundColor || '#bdbdbd';
    newDiv.style.opacity = this._opacity || '0.25';
    newDiv.style.position = 'absolute';
    newDiv.style.top = '0px';
    newDiv.style.left = '0px';

    // Add transclusent background and spinner in parent div.
    this.renderer.appendChild(this.parentDiv, newDiv);
    this.renderer.appendChild(this.parentDiv, spinnerElement);

    // Add parent div to host element.
    let container = this.el.nativeElement;
    this.renderer.appendChild(container, this.parentDiv);
  }

  private removeSpinner() {
    if (!this.parentDiv) return;
    let container = this.el.nativeElement;
    this.renderer.removeChild(container, this.parentDiv);
  }
}
