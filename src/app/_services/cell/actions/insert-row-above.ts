import { WritableSignal } from "@angular/core";
import { CellMapEntry } from "../../../_interfaces";
import { Address } from "../../../_interfaces/address";
import { CellMapEntryService } from "../cell-map-entry.service";
import { Column } from "../../../_interfaces/column";
import { Formula } from "../../formula/formula";

export class InsertRowAbove {
  constructor(
    private readonly cellSignalMap: WritableSignal<Map<string, CellMapEntry>>,
    private readonly numberOfRows: WritableSignal<number>,
    private readonly numberOfColumns: number,
    private readonly rowNumber: number
  ) { }

  perform() {
    // update formulas
    [...this.cellSignalMap().entries()].forEach(([_, { references, formula }]) => {
      const cellsToMove = references().filter((cell) => new Address(cell).getRow() >= this.rowNumber);
      cellsToMove.forEach((cell) => {
        formula.set(new Formula(formula()).replaceCell(cell, new Address(cell).move([1, 0])));
      });
    });

    // synchronize cellSignalMap    
    const newSignalMap = new Map(
      Array.from({ length: this.numberOfColumns }).map((_, index) => {
        return [
          `${new Column(index).getAlias()}${this.rowNumber}`,
          CellMapEntryService.createEntry(this.cellSignalMap)
        ];
      })
    );
    [...this.cellSignalMap().entries()].forEach(([cell, entry]) => {
      if (new Address(cell).getRow() >= this.rowNumber) {
        newSignalMap.set(new Address(cell).move([1, 0]), entry);
        return;
      }
      newSignalMap.set(cell, entry);
    });
    this.cellSignalMap.set(newSignalMap);

    // add row
    this.numberOfRows.set(this.numberOfRows() + 1);
  }
}
