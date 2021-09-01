import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// @Injectable()
export class DwOmHttpClientTest {
  http: HttpClient;
  constructor() {
    this.http = inject(HttpClient);
  }
  public request<T>(method: string, url: string, options?: any): Observable<any> {
    return this.http.request<T>(method, url, options);
  }
  public get<T>(url: string, options?: any): Observable<any> {
    return this.http.get<T>(url, options);
  }
  public post<T>(url: string, body: Object, options?: any): Observable<any> {
    return this.http.post<T>(url, body, options);
  }
  public put<T>(url: string, body: Object, options?: any): Observable<any> {
    return this.http.put<T>(url, body, options);
  }
  public delete<T>(url: string, options: any): Observable<any> {
    return this.http.delete<T>(url, options);
  }
}
