import { WritableSignal } from "@angular/core";
import { CellMapEntry } from "../../../_interfaces";
import { Address } from "../../../_interfaces/address";
import { Column } from "../../../_interfaces/column";

export class DeleteColumn {
  private readonly column: Column;

  constructor(
    private readonly cellSignalMap: WritableSignal<Map<string, CellMapEntry>>,
    private readonly numberOfColumns: WritableSignal<number>,
    columnAlias: string
  ) {
    this.column = new Column(columnAlias)
  }

  perform() {
    // update formulas
    [...this.cellSignalMap().entries()].forEach(([_, { formula, references }]) => {
      const cellsFromDeletedColumn = references().filter((cell) => new Address(cell).getColumn() === this.column.getAlias());
      const cellsToMove = references().filter((cell) =>
        new Column(new Address(cell).getColumn()).getNumber() > this.column.getNumber()
      );

      if (cellsFromDeletedColumn.length) {
        const replaceCellsRegExp = new RegExp(cellsFromDeletedColumn.map((cell) => `(${cell})`).join('|'), 'g');
        formula.set(formula().replace(replaceCellsRegExp, '#REF!'));
      }
      cellsToMove.forEach((cell) => {
        formula.set(formula().replace(new RegExp(cell, 'g'), new Address(cell).move([0, -1])));
      });
    });

    // synchronize cellSignalMap
    const newSignalMap = new Map();
    [...this.cellSignalMap().entries()]
      .filter(([cell]) => new Address(cell).getColumn() !== this.column.getAlias())
      .forEach(([cell, entry]) => {
        if (new Column(new Address(cell).getColumn()).getNumber() < this.column.getNumber()) {
          newSignalMap.set(cell, entry);
          return;
        }
        newSignalMap.set(new Address(cell).move([0, -1]), entry);
      });
    this.cellSignalMap.set(newSignalMap);

    // remove row
    this.numberOfColumns.set(this.numberOfColumns() - 1);
  }
}
