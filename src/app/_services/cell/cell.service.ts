import { Injectable, WritableSignal, computed, inject, signal } from "@angular/core";
import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from "../consts";
import { ColumnAliasPipe } from "../../_features/column-alias.pipe";
import { Formula } from "../formula";
import { Address } from "../../_interfaces/address";
import { CellMapEntry } from "../../_interfaces";
import { DeleteRow } from "./actions/delete-row";
import { DeleteColumn } from "./actions/delete-column";
import { InsertRowAbove } from "./actions/insert-row-above";
import { CellMapEntryService } from "./cell-map-entry.service";
import { InsertColumnOnTheLeft } from "./actions/insert-column-on-the-left";

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
    ? this.cellSignalMap().get(this.selectedCell()).references()
    : []
  );

  public cellSignalMap = signal<Map<string, CellMapEntry>>(new Map());

  constructor() {
    this.cellSignalMap.set(
      new Map<string, CellMapEntry>(
        this.columns().flatMap((columnAlias) =>
          this.rows().map((rowNumber) => {
            return [
              `${columnAlias}${rowNumber}`,
              CellMapEntryService.createEntry(this.cellSignalMap)
            ];
          })
        )
      )
    )
  }

  unselect() {
    this.selectedCell.set('');
  }

  exist(address: string) {
    return this.cellSignalMap().has(address);
  }

  deleteRow(rowNumber: number) {
    new DeleteRow(this.cellSignalMap, this.numberOfRows, rowNumber).perform();
  }

  deleteColumn(alias: string) {
    new DeleteColumn(this.cellSignalMap, this.numberOfColumns, alias).perform();
  }

  insertRowAbove(rowNumber: number) {
    new InsertRowAbove(this.cellSignalMap, this.numberOfRows, this.numberOfColumns(), rowNumber).perform();
  }

  insertColumnOnTheLeft(alias: string) {
    new InsertColumnOnTheLeft(this.cellSignalMap, this.numberOfColumns, this.numberOfRows(), alias).perform();
  }
}
