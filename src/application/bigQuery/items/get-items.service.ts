import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

@Injectable()
export class GetItemsService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(mondayBoards: BoardEntity[]): Promise<string[]> {
    const bigQueryItemsId: string[] = [];

    // GETTING ROWS ON BIGQUERY FROM BOARDS
    for (const board of mondayBoards) {
      const itemsId = await this.bigQueryRepositoryService.getRows(board);

      if (!itemsId) return;

      bigQueryItemsId.push(...itemsId);
    }

    if (!bigQueryItemsId) return null;

    return bigQueryItemsId;
  }
}
