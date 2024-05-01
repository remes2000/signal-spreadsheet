import { Signal, WritableSignal } from "@angular/core";
import { CellProperties } from "./cell-properties";

export interface CellMapEntry {
  formula: WritableSignal<string>;
  properties: WritableSignal<Partial<CellProperties>>;
  value: Signal<unknown>;
  references: Signal<string[]>;
};
