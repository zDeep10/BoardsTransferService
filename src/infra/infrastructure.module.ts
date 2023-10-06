import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BigQuery } from '@google-cloud/bigquery';

// INFRA
import { ApiCallService } from './monday/api-call.service';
import { CreateDatasetService } from './bigQuery/create-dataset.service';
import { CreateTableService } from './bigQuery/table/create-table.service';
import { BigQueryRepositoryService } from './bigQuery/bigQuery-repository.service';
import { MondayRepositoryService } from './monday/monday-repository.service';
import { GetRowsService } from './bigQuery/rows/get-rows.service';
import { UpdateRowsService } from './bigQuery/rows/update-rows.service';
import { CheckPlacesService } from './bigQuery/table/check-places.service';

// DOMAIN
import { MondayRepository } from 'src/domain/repository/monday-repository';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { EntityFactory } from 'src/domain/factory/entity-factory';
import { ErrorDispatch } from '../domain/events/error-dispatch.events';
import { InsertRowsService } from './bigQuery/rows/insert-rows.service';

@Module({
  // CONFIGURATION
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],

  // SERVICES
  providers: [
    BigQuery,

    // CRUD
    CreateDatasetService,
    CreateTableService,
    InsertRowsService,
    GetRowsService,
    UpdateRowsService,

    // UTIL SERVICES
    ApiCallService,
    CheckPlacesService,
    ErrorDispatch,
    EntityFactory,

    // CONTRACTS
    {
      provide: MondayRepository,
      useClass: MondayRepositoryService,
    },
    {
      provide: BigQueryRepository,
      useClass: BigQueryRepositoryService,
    },
  ],

  exports: [MondayRepository, BigQueryRepository],
})
export class InfrastructureModule {}
