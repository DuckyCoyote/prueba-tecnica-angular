import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CpInfoService {
  private token = 'a1ba46bb-5579-4ba5-adb8-89abef0ba2b5';
  private baseUrl = 'https://api.copomex.com/query/info_cp/';

  constructor(private http: HttpClient) {}

  getInfoByCP(cp: string) {
    return this.http.get<any>(`${this.baseUrl}${cp}?token=${this.token}`);
  }
}
