import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, ReplaySubject} from 'rxjs';

export class BaseService {
  public apiUrl: string;
  constructor(protected http: HttpClient){
    this.apiUrl = 'http://localhost:3000/';
  }
  public cacheable<T>(o: Observable<T>): Observable<T>{
    const replay = new ReplaySubject<T>(1);
    o.subscribe(
      x => replay.next(x),
      e => replay.error(e),
      () => replay.complete()
    );
    return replay.asObservable();
  }
public createRequestOptions()
{
  const headers = new HttpHeaders();
  headers.set('Content-Type', 'application/json');
  return{
    headers,
    withCredentials: true
  };
}
protected convertDate(date: Date){
  const convertDate = new Date(date);
  convertDate.setHours(convertDate.getHours() - convertDate.getTimezoneOffset() / 60);
  return convertDate;
}
  public getValidationErrors(err: any): string[]
  {
    const result = new Array<string>();
    for (const property in err.error){
      const errorArray = err.error[property];
      for (const index in errorArray){
        result.push(errorArray[index]);
      }
    }
    return result;

  }
}

