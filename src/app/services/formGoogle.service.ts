import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormGoogleService {
  baseURL: string =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQAbZSjYKkc6HH5If6WT8UC4ezn44F8zo4ZqP0hQgNXOptwXS-tDAleja9Jsg-UsuEt_SXfTcHRRQZj/pubhtml?gid=1242345334&single=false';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any> {
    const data = this.http.get(`${this.baseURL}`);
    return data;
  }
}
