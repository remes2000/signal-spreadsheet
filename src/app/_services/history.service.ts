import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { CellService } from "./cell/cell.service";
import { Snapshot } from "../_interfaces/snapshot";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { debounceTime } from "rxjs";

@Injectable()
@UntilDestroy()
export class HistoryService {
  private readonly cellService = inject(CellService);
  private readonly snapshot = computed<Snapshot>(() => {
    const cellSnapshots = [...this.cellService.cellSignalMap().entries()]
      .filter(([_, { formula, properties }]) => formula() !== '' || !!Object.keys(properties()).length)
      .map(([cell, { formula, properties }]) => ({ address: cell, formula: formula(), properties: properties() }));
    return {
      cells: cellSnapshots,
      numberOfColumns: this.cellService.numberOfColumns(),
      numberOfRows: this.cellService.numberOfRows(),
    };
  });
  private readonly snapshot$ = toObservable(this.snapshot);
  private readonly _undoStack = signal<Snapshot[]>([]);
  private readonly _redoStack = signal<Snapshot[]>([]);

  public readonly undoStack = this._undoStack.asReadonly();
  public readonly redoStack = this._redoStack.asReadonly();
  private skipNext = false;
  private previous: Snapshot = null;

  constructor() {
    this.snapshot$.pipe(
      debounceTime(500),
      untilDestroyed(this)
    ).subscribe((snapshot) => {
      if (this.skipNext) {
        this.skipNext = false;
        return;
      }
      if (this.previous) {
        this._undoStack.update((stack) => [this.previous, ...stack]);
      }
      if (this._redoStack().length) {
        this._redoStack.set([]);
      }
      this.previous = snapshot;
    });
  }

  undo() {
    if (!this._undoStack().length) {
      return;
    }
    const [snapshot, ...undoStack] = this._undoStack();
    this._undoStack.set(undoStack);
    this._redoStack.update((stack) => [this.snapshot(), ...stack]);
    this.skipNext = true;
    this.cellService.applySnapshot(snapshot);
  }

  redo() {
    if (!this._redoStack().length) {
      return;
    }
    const [snapshot, ...redoStack] = this._redoStack();
    this._redoStack.set(redoStack);
    this._undoStack.update((stack) => [this.snapshot(), ...stack]);
    this.skipNext = true;
    this.cellService.applySnapshot(snapshot);
  }
}
