import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Transferencia } from './transferencia';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  private readonly url = 'http://localhost:8081/api/transferencia';

  private http = inject(HttpClient);

  getAll(): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(this.url);
  }

  create(transferencia: Transferencia): Observable<Transferencia> {
    return this.http.post<Transferencia>(this.url, transferencia);
  }
}
