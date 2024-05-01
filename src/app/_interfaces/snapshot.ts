import { CellProperties } from "./cell-properties";

export class Snapshot {
  cells: CellSnapshot[];
  numberOfColumns: number;
  numberOfRows: number;
}

export class CellSnapshot {
  address: string;
  formula: string;
  properties: Partial<CellProperties>;
}