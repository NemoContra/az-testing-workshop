import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { HttpClient } from '@angular/common/http';

const API_BASE_URL = '/api';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private httpClient = inject(HttpClient);

  getContracts(query?: string): Observable<Contract[]> {
    return this.httpClient.get<Contract[]>(
      `${API_BASE_URL}/contracts`,
      query ? { params: { query } } : undefined
    );
  }

  getContract(id: string): Observable<Contract> {
    return this.httpClient.get<Contract>(`${API_BASE_URL}/contracts/${id}`);
  }

  updateContract(contract: Contract): Observable<Contract> {
    return this.httpClient.put<Contract>(`${API_BASE_URL}/contracts`, contract);
  }
}
