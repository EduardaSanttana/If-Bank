import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Conta } from './conta';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  private readonly url = 'http://localhost:8081/api/conta';

  private http = inject(HttpClient);

  getAll(): Observable<Conta[]> {
    return this.http.get<Conta[]>(this.url);
  }
}
