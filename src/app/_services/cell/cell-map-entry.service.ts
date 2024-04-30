import { Signal, computed, signal } from "@angular/core";
import { CellMapEntry } from "../../_interfaces";
import { Formula } from "../formula";

export class CellMapEntryService {
  public static createEntry(cellMapSignal: Signal<Map<string, CellMapEntry>>, formula = ''): CellMapEntry {
    const formulaSignal = signal(formula);
    return {
      formula: formulaSignal,
      value: computed(() => new Formula(formulaSignal()).execute(cellMapSignal())),
      references: computed(() => new Formula(formulaSignal()).getReferences())
    }
  }
}
