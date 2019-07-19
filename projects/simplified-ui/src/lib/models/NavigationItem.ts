import { Subject } from "rxjs";

export class NavigationItem {

  constructor(public name: string, public route: string, public iconUrl?: string) { }

  obs = new Subject<string>();
  public obs$ = this.obs.asObservable();

  triggerNext() {
    this.obs.next(this.route);
  }

  unsubscribeEvent() {
    this.obs.unsubscribe();
  }

}
