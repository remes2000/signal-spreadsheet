import { WritableSignal } from "@angular/core";
import { CellMapEntry } from "../../../_interfaces";
import { Column } from "../../../_interfaces/column";
import { Address } from "../../../_interfaces/address";
import { CellMapEntryService } from "../cell-map-entry.service";

export class InsertColumnOnTheLeft {
  private readonly column: Column;

  constructor(
    private readonly cellSignalMap: WritableSignal<Map<string, CellMapEntry>>,
    private readonly numberOfColumns: WritableSignal<number>,
    private readonly numberOfRows: number,
    columnAlias: string
  ) {
    this.column = new Column(columnAlias);
  }

  perform() {
    // update formulas
    [...this.cellSignalMap().entries()].forEach(([_, { references, formula }]) => {
      const cellsToMove = references().filter((cell) => new Column(new Address(cell).getColumn()).getNumber() >= this.column.getNumber());
      cellsToMove.forEach((cell) => {
        formula.set(formula().replace(new RegExp(cell, 'g'), new Address(cell).move([0, 1])));
      });
    });

    // synchronize cellSignalMap    
    const newSignalMap = new Map(
      Array.from({ length: this.numberOfRows }).map((_, index) => {
        return [
          `${this.column.getAlias()}${index + 1}`,
          CellMapEntryService.createEntry(this.cellSignalMap)
        ];
      })
    );
    [...this.cellSignalMap().entries()].forEach(([cell, entry]) => {
      if (new Column(new Address(cell).getColumn()).getNumber() >= this.column.getNumber()) {
        newSignalMap.set(new Address(cell).move([0, 1]), entry);
        return;
      }
      newSignalMap.set(cell, entry);
    });
    this.cellSignalMap.set(newSignalMap);

    // add column
    this.numberOfColumns.set(this.numberOfColumns() + 1);
  }
}
