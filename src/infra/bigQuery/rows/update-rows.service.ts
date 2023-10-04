import { Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { Board } from 'src/domain/entities/board/board';
import { TransferResponse } from 'src/domain/valueObjects/crud-operations.vo';

@Injectable()
export class UpdateRowsService {
  private readonly logger = new Logger(UpdateRowsService.name);

  // UPDATE ITEMS
  async run(duplicateItems: any[], table: Table): Promise<TransferResponse> {
    // if (!payload) return null;

    const itemIds = duplicateItems.map((item) => item.id_de_elemento);

    const query = `SELECT * FROM ${
      table.id
    } WHERE id_de_elemento IN (${itemIds.join(',')})`;

    // // Run the update queries
    // for (const query of updateQueries) {
    //   const [job] = await this.bigQueryClient.createQueryJob({
    //     query: query,
    //   });
    //   const [rows] = await job.getQueryResults();
    //   // Handle or log the results if needed
    // }

    console.log(query);
    return {
      tableId: table.id,
      status: 'success',
      insertedPayload: duplicateItems,
    };
  }
}
