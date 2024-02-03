import { Module } from '@nestjs/common';

import { ContractController } from './contract/contract.controller';
import { DatabaseService } from './database/database.service';
import { FlightController } from './flight/flight.controller';
import { FlightService } from './flight/flight.service';

@Module({
  imports: [],
  controllers: [ContractController, FlightController],
  providers: [DatabaseService, FlightService],
})
export class AppModule {}
