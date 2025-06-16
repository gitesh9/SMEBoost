import { Injectable } from '@angular/core';
import { DataResponse } from './data-types';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalStore {
  public dataSubject = new Subject<DataResponse>();
  public data$ = this.dataSubject.asObservable();
  private _myData: DataResponse | undefined;

  constructor(private http: HttpClient) { }

  getData(id: string) {
    const source = new EventSource(`http://127.0.0.1:8000/api/stream/${id}`)

    source.onmessage = event => {
      const payload = JSON.parse(event.data);
      console.log(payload);
      this._myData = { ...this._myData, ...payload }
    };
  }

  set myData(data: DataResponse) {
    this._myData = { ...data }
  }
}
