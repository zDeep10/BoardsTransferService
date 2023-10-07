import { Board } from 'src/domain/entities/board/board';

export class SchemaGenerator {
  private schema;

  run(board: Board) {
    const uniqueColumnTitles = new Set();

    // LOOPING THROUGHT EACH COLUMN FROM BOARDS.ITEMS
    const schemaFromItems = board.items_page.items.flatMap((item) => {
      return item.column_values
        .map((column) => {
          // CHEKING FOR REPEATED COLUMNS ON THE SCHEMA
          if (uniqueColumnTitles.has(column.column.title)) return null;

          uniqueColumnTitles.add(column.column.title);

          return {
            name: column.column.title,
            type: 'STRING',
            mode: 'NULLABLE',
          };
        })
        .filter(Boolean);
    });

    console.log(schemaFromItems);

    this.schema = [
      {
        name: board.item_terminology,
        type: 'STRING',
        mode: 'NULLABLE',
      },
      { name: 'grupo', type: 'STRING', mode: 'NULLABLE' },
      ...schemaFromItems,
    ];

    return this.schema;
  }
}