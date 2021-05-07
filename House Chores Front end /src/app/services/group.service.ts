import { Injectable } from '@angular/core';
// import {BaseService} from '../base/base.service'
import { HttpClient } from '@angular/common/http';
import { Group } from '../model/Group';
// import { BaseService } from './base/base.service';
import {pipe, throwError} from 'rxjs'; 
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GroupService{
  baseUrl = 'https://tyler-nodejs-app.herokuapp.com/';
  constructor(protected http: HttpClient) {
   }
   async createGroup(group: Group)
   {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(group);
    return this.http.post<any>(this.baseUrl + 'groups', body, {headers}).pipe(catchError(this.handleError));
  }
  public getGroupForUser(userName: string): any
  {
    const header = {'content-type': 'application/json'};
    return this.http.get<any>(this.baseUrl+ 'findGroup/' + userName).pipe(catchError(this.handleError));
  }
  public deleteGroup(groupId: number): any
  {
    return this.http.delete<any>(this.baseUrl + 'deleteGroup/' + groupId).pipe(catchError(this.handleError));
  }
  public getMembersForGroup(groupId: number): any
  {
    return this.http.get(this.baseUrl + 'getMembers/' +  groupId).pipe(catchError(this.handleError));
  }
  public getGroupUserAddedIn(userName: string): any
  {
    const header = {'conte  t-type': 'application/json'};
    const body = JSON.stringify(userName);
    return this.http.get<any>(this.baseUrl  + 'groupsAdded/' + userName).pipe(catchError(this.handleError));
  }
 async leaveGroup(groupId, userName)
  {
    return this.http.delete<any>(this.baseUrl + 'leaveGroup/' + userName + '/' + groupId).pipe(catchError(this.handleError));
  }
 async addMembers(groupsId, members, GroupName )
  {
    const obj  = {
      groupId: groupsId,
      members,
      GroupName
    };
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(obj);
    return this.http.post<any>(this.baseUrl + 'addmembers', body, {headers}).pipe(catchError(this.handleError));
  }
  handleError(error)
  {
    return throwError(error || "server error "); 
  }
}
