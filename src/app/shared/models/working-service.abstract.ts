import { BehaviorSubject, combineLatest, merge, Observable } from "rxjs";

export abstract class WorkingService {
  
  protected _workingSubject = new BehaviorSubject<boolean>(false);
  working$(): Observable<boolean> { return this._workingSubject.asObservable(); }
  protected setWorking(value: boolean) { this._workingSubject.next(value); }
  combineWorking$(...observables: Observable<boolean>[]): Observable<boolean> {
    return merge(...observables,this.working$());
  }
}