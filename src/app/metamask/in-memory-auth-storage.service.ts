import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { AuthStorage } from "./metamask.service";

@Injectable({
  providedIn: "root",
})
export class InMemoryAuthStorageService extends AuthStorage {
  protected _payload: any = undefined;
  protected _payload$: any = new BehaviorSubject<any>(this._payload);

  constructor() {
    super();
  }

  get() {
    return this._payload;
  }

  get$() {
    return this._payload$.asObservable();
  }

  set(payload: any) {
    this._payload = payload;
    this._payload$.next(payload);
  }
}
