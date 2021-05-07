import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tasks } from '../model/Tasks';
import { TaskStatus } from '../model/TaskStatus';
import { pipe, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TasksService {
  taskStatus: TaskStatus;
  baseUrl = 'https://tyler-nodejs-app.herokuapp.com/';

  constructor(protected http: HttpClient) { }
  public createTask(task: Tasks): any {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(task);

    return this.http.post<any>(this.baseUrl + 'tasks', body, { headers }).pipe(catchError(this.handleError));
  }
  public getTaskForUser(assignedUser: String): any {
    const headers = { 'content-type': 'application/json' };


    return this.http.get<any>(this.baseUrl + 'usersTask/' + assignedUser).pipe(catchError(this.handleError));;
  }
  public getTaskCreatedByUser(createdBy: String): any {
    const headers = { 'content-type': 'application/json' };
    return this.http.get<any>(this.baseUrl + 'tasksCreated/' + createdBy).pipe(catchError(this.handleError));;
  }
  async completeTask(taskId: number, todayDate: string) {
    const headers = { 'content-type': 'application/json' };
    const body: JSON = {
      complete: 1,
      dateCompleted: todayDate
    } as unknown as JSON;
    return this.http.put<any>(this.baseUrl + 'taskIsComplete/' + taskId, body, { headers }).pipe(catchError(this.handleError));;
  }
  public getToDoTasks(userAssigned: String): any // is that why the arrays werent working before
  {
    const headers = { 'content-type': 'application/json' };

    return this.http.get<any>(this.baseUrl + 'getInToDo/' + userAssigned, { headers }).pipe(catchError(this.handleError));
  }
  public getInProgress(userAssigned: String): any {
    const headers = { 'content-type': 'application/json' };
    return this.http.get<any>(this.baseUrl + 'getInProgress/' + userAssigned, { headers }).pipe(catchError(this.handleError));
  }
  public getCompleteTasks(userAssigned: String): any // is that why the arrays werent working before
  {
    const headers = { 'content-type': 'application/json' };

    return this.http.get<any>(this.baseUrl + 'completedTasks/' + userAssigned, { headers }).pipe(catchError(this.handleError));
  }
  async getTaskById(taskId) {
    return this.http.get<any>(this.baseUrl + 'getTaskById/' + taskId).pipe(catchError(this.handleError));

  }
  async deleteTask(taskId) {
    const body = JSON.stringify(taskId);
    const headers = { 'content-type': 'application/json' };
    return this.http.delete<any>(this.baseUrl + 'deleteTask/' + taskId).pipe(catchError(this.handleError));
  }
  async updateStatus(tasks) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(tasks);
    return this.http.put<any>(this.baseUrl + 'updateStatus', body, { headers }).pipe(catchError(this.handleError));
  }
  async editTask(tasks) {
    const headers = { 'content-type': 'application/json' };

    const body = JSON.stringify(tasks);
    return this.http.put<any>(this.baseUrl + 'editTask/', body, { headers }).pipe(catchError(this.handleError));
  }
  handleError(error) {
    return throwError(error || "server error");
  }
}
