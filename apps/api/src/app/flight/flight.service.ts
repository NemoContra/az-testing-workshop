import { Injectable } from '@nestjs/common';
import { CreateFlightDto, Flight } from '@az-testing-workshop/shared/util/api-models';

@Injectable()
export class FlightService {
  private flights: Flight[] = [
    {
      from: 'Stuttgart',
      to: 'Graz',
      time: '2024-02-03T15:00:00',
      delayed: false,
    },
  ];

  createFlight(newFlight: CreateFlightDto): Flight {
    this.flights = [
       ...this.flights,
       newFlight as Flight
    ]
    return newFlight as Flight;
  }

  getAllFlights(): Flight[] {
    return this.flights;
  }
}
