import { Injectable, computed, inject, signal } from "@angular/core";
import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from "../consts";
import { ColumnAliasPipe } from "../../_features/column-alias.pipe";
import { Address } from "../../_interfaces/address";
import { CellMapEntry } from "../../_interfaces";
import { DeleteRow } from "./actions/delete-row";
import { DeleteColumn } from "./actions/delete-column";
import { InsertRowAbove } from "./actions/insert-row-above";
import { CellMapEntryService } from "./cell-map-entry.service";
import { InsertColumnOnTheLeft } from "./actions/insert-column-on-the-left";
import { Snapshot } from "../../_interfaces/snapshot";

@Injectable()
export class CellService {
  private readonly columnAliasPipe = inject(ColumnAliasPipe);
  private readonly _numberOfColumns = signal(0);
  private readonly _numberOfRows = signal(0);

  public readonly numberOfColumns = this._numberOfColumns.asReadonly();
  public readonly numberOfRows = this._numberOfRows.asReadonly();
  public readonly columns = computed(() => Array.from({ length: this._numberOfColumns() }).map((_, index) => this.columnAliasPipe.transform(index)));
  public readonly rows = computed(() => Array.from({ length: this._numberOfRows() }).map((_, index) => index + 1));

  public selectedCell = signal('');
  public selectedColumn = computed(() => this.selectedCell() ? new Address(this.selectedCell()).getColumn() : null);
  public selectedRow = computed(() => this.selectedCell() ? new Address(this.selectedCell()).getRow() : null);
  public mentionedCells = computed(() => this.selectedCell()
    ? this.cellSignalMap().get(this.selectedCell()).references()
    : []
  );

  public cellSignalMap = signal<Map<string, CellMapEntry>>(new Map());

  constructor() {
    this.applySnapshot({ cells: [], numberOfColumns: NUMBER_OF_COLUMNS, numberOfRows: NUMBER_OF_ROWS });
  }

  unselect() {
    this.selectedCell.set('');
  }

  exist(address: string) {
    return this.cellSignalMap().has(address);
  }

  deleteRow(rowNumber: number) {
    new DeleteRow(this.cellSignalMap, this._numberOfRows, rowNumber).perform();
  }

  deleteColumn(alias: string) {
    new DeleteColumn(this.cellSignalMap, this._numberOfColumns, alias).perform();
  }

  insertRowAbove(rowNumber: number) {
    new InsertRowAbove(this.cellSignalMap, this._numberOfRows, this._numberOfColumns(), rowNumber).perform();
  }

  insertColumnOnTheLeft(alias: string) {
    new InsertColumnOnTheLeft(this.cellSignalMap, this._numberOfColumns, this._numberOfRows(), alias).perform();
  }

  applySnapshot(snapshot: Snapshot) {
    this._numberOfRows.set(snapshot.numberOfRows);
    this._numberOfColumns.set(snapshot.numberOfColumns);
    const snapshotCellMap = new Map(snapshot.cells.map(({ address, formula, properties }) => [address, { formula, properties }]));
    const newMap = new Map<string, CellMapEntry>(
      this.columns().flatMap((columnAlias) =>
        this.rows().map((rowNumber) => {
          const address = `${columnAlias}${rowNumber}`;
          const { formula, properties } = snapshotCellMap.get(address) ?? {};
          return [
            address,
            CellMapEntryService.createEntry(this.cellSignalMap, formula ?? '', properties ?? {})
          ];
        })
      )
    );
    this.cellSignalMap.set(newMap);
  }
}
