import { Injectable, Signal, WritableSignal, computed, inject, signal } from "@angular/core";
import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from "./consts";
import { ColumnAliasPipe } from "../_features/column-alias.pipe";
import { Formula } from "./formula";
import { Address } from "../_interfaces/address";

@Injectable()
export class CellService {
  private columnAliasPipe = inject(ColumnAliasPipe);
  public columns = signal<string[]>(
    Array.from({ length: NUMBER_OF_COLUMNS }).map((_, columnIndex) => this.columnAliasPipe.transform(columnIndex))
  );
  public rows = signal<number[]>(Array.from({ length: NUMBER_OF_ROWS }).map((_, rowIndex) => rowIndex + 1));
  public selectedCell = signal<string>('');
  public selectedColumn = computed(() => {
    if (!this.selectedCell()) {
      return '';
    }
    return new Address(this.selectedCell()).getColumn();
  });
  public selectedRow = computed(() => {
    if (!this.selectedCell()) {
      return null;
    }
    return new Address(this.selectedCell()).getRow();
  });

  private cellFormulaMap = new Map<string, WritableSignal<string>>(
    this.columns().flatMap((columnAlias) => 
      this.rows().map((rowNumber) => [`${columnAlias}${rowNumber}`, signal('')])
    )
  );

  private cellValueMap: Map<string, Signal<unknown>> = new Map<string, Signal<unknown>>(
    this.columns().flatMap((columnAlias) => 
      this.rows().map((rowNumber) => {
        const cellAlias = `${columnAlias}${rowNumber}`;
        return [cellAlias, computed(() => {
          const formula = this.cellFormulaMap.get(cellAlias)();
          if (!formula.startsWith('=')) {
            return formula;
          }
          return new Formula(formula.slice(1), this.cellValueMap).execute();
        })];
      })
    )
  );

  getFormulaSignal(address: string): WritableSignal<string> {
    return this.cellFormulaMap.get(address);
  }

  getValueSignal(address: string): Signal<unknown> {
    return this.cellValueMap.get(address);
  }

  clearSelectedCell() {
    this.selectedCell.set('');
  }

  exist(address: string) {
    return this.cellValueMap.has(address);
  }
}
