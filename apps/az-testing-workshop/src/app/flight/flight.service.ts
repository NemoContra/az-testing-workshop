import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateFlightDto, Flight } from '@az-testing-workshop/shared/util/api-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private readonly httpClient = inject(HttpClient);

  createFlight(newFlight: CreateFlightDto): Observable<Flight> {
    return this.httpClient.post<Flight>('/flights', newFlight)
  }
}
