import { Signal, computed, signal } from "@angular/core";
import { CellMapEntry } from "../../_interfaces";
import { Formula } from "../formula/formula";
import { CellProperties } from "../../_interfaces/cell-properties";

export class CellMapEntryService {
  public static createEntry(cellMapSignal: Signal<Map<string, CellMapEntry>>, formula = '', properties: Partial<CellProperties> = {}): CellMapEntry {
    const formulaSignal = signal(formula);
    const propertiesSignal = signal<Partial<CellProperties>>(properties);
    return {
      formula: formulaSignal,
      properties: propertiesSignal,
      value: computed(() => new Formula(formulaSignal()).execute(cellMapSignal())),
      references: computed(() => new Formula(formulaSignal()).getReferences())
    }
  }
}
