import {Injectable} from '@angular/core'
import {Subject}    from 'rxjs';

@Injectable()
export class AppState {

  private _data: any = new Subject<any>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions:Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor() {
    this._dataStream$.subscribe((data: any) => this._onEvent(data));
  }

  notifyDataChanged(event: any, value: any) {
    let current = this._data[event];
    if (current != value) {
      this._data[event] = value;

      this._data.next({
        event: event,
        data: this._data[event]
      });
    }
  }

  subscribe(event:string, callback:Function) {
    var subscribers = this._subscriptions.get(event) || [];
    subscribers.push(callback);

    this._subscriptions.set(event, subscribers);
  }

  _onEvent(data:any) {
    var subscribers = this._subscriptions.get(data['event']) || [];

    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }
}
