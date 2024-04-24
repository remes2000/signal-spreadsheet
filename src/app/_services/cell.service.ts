import { Injectable, computed, inject, signal } from "@angular/core";
import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from "./consts";
import { ColumnAliasPipe } from "../_features/column-alias.pipe";
import { Formula } from "./formula";
import { Address } from "../_interfaces/address";
import { CellMapEntry } from "../_interfaces";

@Injectable()
export class CellService {
  private readonly columnAliasPipe = inject(ColumnAliasPipe);
  private readonly numberOfColumns = signal(NUMBER_OF_COLUMNS);
  private readonly numberOfRows = signal(NUMBER_OF_ROWS);

  public readonly columns = computed(() => Array.from({ length: this.numberOfColumns() }).map((_, index) => this.columnAliasPipe.transform(index)));
  public readonly rows = computed(() => Array.from({ length: this.numberOfRows() }).map((_, index) => index + 1));

  public selectedCell = signal('');
  public selectedColumn = computed(() => this.selectedCell() ? new Address(this.selectedCell()).getColumn() : null);
  public selectedRow = computed(() => this.selectedCell() ? new Address(this.selectedCell()).getRow() : null);
  public mentionedCells = computed(() => this.selectedCell() 
    ? this.cellSignalMap.get(this.selectedCell()).references()
    : []
  );

  // todo: this map should be signal as well
  // this can change while removing/adding rows/columns
  private cellSignalMap: Map<string, CellMapEntry> = new Map<string, CellMapEntry>(
    this.columns().flatMap((columnAlias) =>
      this.rows().map((rowNumber) => {
        const formulaSignal = signal('');
        return [
          `${columnAlias}${rowNumber}`,
          {
            formula: formulaSignal,
            value: computed(() => new Formula(formulaSignal()).execute(this.cellSignalMap)),
            references: computed(() => new Formula(formulaSignal()).getReferences())
          }
        ];
      })
    )
  );

  getFormulaSignal(address: string) {
    return this.cellSignalMap.get(address).formula;
  }

  getValueSignal(address: string) {
    return this.cellSignalMap.get(address).value;
  }

  unselect() {
    this.selectedCell.set('');
  }

  exist(address: string) {
    return this.cellSignalMap.has(address);
  }

  deleteRow(rowNumber: number) {
    // synchronize cellSignalMap
    const entriesToRemove = [...this.cellSignalMap.entries()].filter(([address]) => 
      new Address(address).getRow() === rowNumber
    );
    const entriesToMove = [...this.cellSignalMap.entries()].filter(([address]) => 
      new Address(address).getRow() > rowNumber
    );
    [...entriesToMove, ...entriesToRemove].forEach(([address]) => this.cellSignalMap.delete(address));
    entriesToMove.forEach(([address, entry]) => {
      this.cellSignalMap.set(new Address(address).move([-1, 0]), entry);
    });
    // update formulas
    [...this.cellSignalMap.entries()].forEach(([_, { formula, references }]) => {
      const cellsFromDeletedRow = references().filter((cell) => new Address(cell).getRow() === rowNumber);
      const cellsToMove = references().filter((cell) => new Address(cell).getRow() > rowNumber);

      if (cellsFromDeletedRow.length) {
        const replaceCellsRegExp = new RegExp(cellsFromDeletedRow.map((cell) => `(${cell})`).join('|'), 'g');
        formula.set(formula().replace(replaceCellsRegExp, '#REF!'));
      }
      cellsToMove.forEach((cell) => {
        formula.set(formula().replace(new RegExp(cell, 'g'), new Address(cell).move([-1, 0])));
      });
    });
    // remove row
    this.numberOfRows.set(this.numberOfRows() - 1);
  }

  deleteColumn(alias: string) {
    // todo:
    this.numberOfColumns.set(this.numberOfColumns() - 1);
  }
}
