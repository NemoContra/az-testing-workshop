import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { CreateFlightDto, createFlightSchema, Flight } from '@az-testing-workshop/shared/util/api-models';
import { FlightService } from './flight.service';
import { ValidationPipe } from '../common/validation.pipe';

@Controller('flights')
export class FlightController {

  constructor(private readonly flightService: FlightService) {
  }

  @Get('')
  getFlights(): Flight[] {
    return this.flightService.getAllFlights();
  }

  @Post('')
  @UsePipes(new ValidationPipe(createFlightSchema))
  createFlight(@Body() flight: CreateFlightDto): void {
    this.flightService.createFlight(flight);
  }
}
