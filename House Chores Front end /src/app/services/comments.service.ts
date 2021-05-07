import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comments } from '../model/Comments';
import { catchError, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  comments: Comments[];

  constructor(protected http: HttpClient) {

  }
  baseUrl = 'https://tyler-nodejs-app.herokuapp.com/';
  public async  createComment(comments)
  {
     const headers = {'content-type': 'application/json'};
     const body = JSON.stringify(comments);
     return this.http.post<any>( this.baseUrl + 'createComment', body, {headers});
  }
}
