import { CheckPlacesService } from './utils/check-places.service';
import { BigQuery, Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { SchemaGenerator } from './utils/schema-generator';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

@Injectable()
export class CreateTablesService {
  private logger = new Logger(CreateTablesService.name);
  private schemaGenerator: SchemaGenerator;

  constructor(private checkPlacesService: CheckPlacesService) {
    this.schemaGenerator = new SchemaGenerator();
  }

  async run(location: string, bigQuery: BigQuery, boards: BoardEntity[]) {
    try {
      const promises = boards.map(async (board) => {
        // CHECKING FOR TABLE AND DATASETS EXISTENCES
        const { exists, table, datasetName, tableName } =
          await this.checkPlacesService.run(board, location, bigQuery);

        // CREATING TABLE IF NOT EXISTES
        if (!exists) {
          const schema = this.schemaGenerator.run(board);

          // Include the board_id label here
          const options = {
            schema: schema,
            labels: {
              board_id: board.getId(),
            },
          };

          const [newTable] = await bigQuery
            .dataset(datasetName)
            .createTable(tableName, options);

          console.log('Nova Tabela criada:', newTable.id);

          // RETURNING NEW TABLE
          return newTable;
        }

        console.log('Tabela existente:', table.id);

        return table;
      });

      const tables = await Promise.all(promises);
      return tables as Table[];
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
