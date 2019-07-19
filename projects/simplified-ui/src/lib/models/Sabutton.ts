import { Subject } from "rxjs";
import { ElementRef } from "@angular/core";

export class SaButton {

  constructor(public title: string) { }

  obs = new Subject<ElementRef>();
  public obs$ = this.obs.asObservable();;

  triggerNext(elRef) {
    this.obs.next(elRef);
  }

  unsubscribeEvent() {
    this.obs.unsubscribe();
  }

}
