import { WritableSignal } from "@angular/core";
import { CellMapEntry } from "../../../_interfaces";
import { Address } from "../../../_interfaces/address";

export class DeleteRow {
  constructor(
    private readonly cellSignalMap: WritableSignal<Map<string, CellMapEntry>>,
    private readonly numberOfRows: WritableSignal<number>,
    private readonly rowNumber: number
  ) { }

  perform() {
    // update formulas
    [...this.cellSignalMap().entries()].forEach(([_, { formula, references }]) => {
      const cellsFromDeletedRow = references().filter((cell) => new Address(cell).getRow() === this.rowNumber);
      const cellsToMove = references().filter((cell) => new Address(cell).getRow() > this.rowNumber);

      if (cellsFromDeletedRow.length) {
        const replaceCellsRegExp = new RegExp(cellsFromDeletedRow.map((cell) => `(${cell})`).join('|'), 'g');
        formula.set(formula().replace(replaceCellsRegExp, '#REF!'));
      }
      cellsToMove.forEach((cell) => {
        formula.set(formula().replace(new RegExp(cell, 'g'), new Address(cell).move([-1, 0])));
      });
    });

    // synchronize cellSignalMap
    const newSignalMap = new Map();
    [...this.cellSignalMap().entries()]
      .filter(([cell]) => new Address(cell).getRow() !== this.rowNumber)
      .forEach(([cell, entry]) => {
        if (new Address(cell).getRow() < this.rowNumber) {
          newSignalMap.set(cell, entry);
          return;
        }
        newSignalMap.set(new Address(cell).move([-1, 0]), entry);
      });
    this.cellSignalMap.set(newSignalMap);

    // remove row
    this.numberOfRows.set(this.numberOfRows() - 1);
  }
}
