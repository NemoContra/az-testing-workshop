import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Contract } from '@az-testing-workshop/shared/util/api-models';

@Controller('contracts')
export class ContractController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('')
  getAllContracts(): Promise<Contract[]> {
    return this.databaseService.getAllContracts();
  }

  @Get(':id')
  async getContractById(
    @Param('id') id: string
  ): Promise<Contract | undefined> {
    const contract = await this.databaseService.getContractById(id);

    if (!contract) {
      throw new NotFoundException();
    }

    return contract;
  }

  @Put('')
  async updateContract(@Body() contract: Contract): Promise<Contract> {
    const updatedContract = await this.databaseService.updateContract(contract);

    if (!updatedContract) {
      throw new NotFoundException();
    }

    return updatedContract;
  }
}
