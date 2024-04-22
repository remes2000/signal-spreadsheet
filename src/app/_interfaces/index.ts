import { Signal, WritableSignal } from "@angular/core";

export interface CellMapEntry {
  formula: WritableSignal<string>;
  value: Signal<number>;
  references: Signal<string[]>;
};
