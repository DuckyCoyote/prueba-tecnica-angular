import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { env } from 'process';

@Injectable({ providedIn: 'root' })
export class CpInfoService {
  private token = process.env.CP_INFO_API_TOKEN || 'your_default_token_here';
  private baseUrl = 'https://api.copomex.com/query/info_cp/';

  constructor(private http: HttpClient) {}

  getInfoByCP(cp: string) {
    return this.http.get<any>(`${this.baseUrl}${cp}?token=${this.token}`);
  }
}
