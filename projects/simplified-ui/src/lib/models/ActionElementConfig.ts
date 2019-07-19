import { Subject, Observable } from "rxjs";

export abstract class ActionElementConfig {

  clickSubject: Subject<Event> = new Subject<Event>();

  data: any = null;

  get onClick(): Observable<Event> {
    return this.clickSubject.asObservable();
  }


  constructor(public title: string) { }
}
