import { Injectable } from '@angular/core';
import  {io} from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
readonly url: string = 'localhost:3000';
  constructor() {
    this.socket = io(this.url);
   }
  socket: any;
  listen(eventName: string)
  {
    return new Observable((subscriber) => {
      this.socket.on(eventName), (data) =>
      {
        subscriber.next(data);
      };
    });
  }
  emit(eventName: string, data: any)
  {
    this.socket.emit(eventName, data);
  }
}

