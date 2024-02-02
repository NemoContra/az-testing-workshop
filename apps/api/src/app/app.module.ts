import { Module } from '@nestjs/common';

import { ContractController } from './contract/contract.controller';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [],
  controllers: [ContractController],
  providers: [DatabaseService],
})
export class AppModule {}
