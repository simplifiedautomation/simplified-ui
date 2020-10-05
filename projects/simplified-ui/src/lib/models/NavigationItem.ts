import { Observable, Subject } from 'rxjs';

export class NavigationItem {
  constructor(
    public name: string,
    public route: string,
    public iconUrl?: string,
    public badge: Observable<string> = null
  ) {}

  obs = new Subject<string>();
  public obs$ = this.obs.asObservable();

  triggerNext() {
    this.obs.next(this.route);
  }

  unsubscribeEvent() {
    this.obs.unsubscribe();
  }
}
