import { Injectable } from '@angular/core';
// import {BaseService} from '../base/base.service'
import { HttpClient } from '@angular/common/http';
import { Message} from '../model/Message'; 
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
  })
export class MessageService{
    baseUrl = 'https://tyler-nodejs-app.herokuapp.com/';
  constructor(protected http: HttpClient) {
   }
   public getMessagesForGroup( groupId: number) : any
   {
     
       return this.http.get<any>(this.baseUrl + "messages/" + groupId).pipe(catchError(this.handleError));       
   }
   handleError(error)
   {
     return throwError(error || "server error"); 
   }

}  