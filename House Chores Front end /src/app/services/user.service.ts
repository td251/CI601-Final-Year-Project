import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';
import { User } from '../model/User';
import { Login } from '../model/Login';

import { fromEventPattern } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Data } from '@angular/router';
import { pipe, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  body: any;
  baseUrl = 'https://tyler-nodejs-app.herokuapp.com/';


  constructor(protected http: HttpClient) {
    super(http);
  }

  async newUser(user: User) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(user);
    return this.http.post<any>(this.baseUrl + 'users', body, { headers }).pipe(catchError(this.handleError));
  }
  public login(login: Login): any {
    // denotes what the content is encoded in
    // http headers
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(login);

    return this.http.post<any>(this.baseUrl + 'login', body, { headers }).pipe(catchError(this.handleError));
  }
  public getUsers(): any {
    // change to heroku url
    return this.http.get<any>(this.baseUrl + 'getUsers').pipe(catchError(this.handleError));
  }
  public photoUpload(file: FormData) {


    file.forEach((value, key) => {
    });

    return this, this.http.post("http://localhost:3000/uploadImage/", file).pipe(catchError(this.handleError));;
  }
  handleError(error) {
    return throwError(error || "server error ");
  }
}


