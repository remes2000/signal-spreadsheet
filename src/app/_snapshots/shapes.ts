import { FontWeight } from "../_interfaces/cell-properties";
import { Snapshot } from "../_interfaces/snapshot";

export const snapshot: Snapshot = {
  cells: [
    { address: 'A1', formula: 'Shapes', properties: { backgroundColor: '#00ff00', fontWeight: FontWeight.BOLD } },
    { address: 'A2', formula: 'Square', properties: { backgroundColor: '#ff0000', fontWeight: FontWeight.BOLD } },
    { address: 'A3', formula: 'Side:', properties: { backgroundColor: '#ff0000' } },
    { address: 'B3', formula: '5', properties: { backgroundColor: '#ff0000' } },
    { address: 'A4', formula: 'Area:', properties: { backgroundColor: '#ff0000', fontWeight: FontWeight.BOLD } },
    { address: 'B4', formula: '=Math.pow(B3, 2)', properties: { backgroundColor: '#ff0000', fontWeight: FontWeight.BOLD } },
    { address: 'A5', formula: 'Rectangle', properties: { backgroundColor: '#8e8efb', fontWeight: FontWeight.BOLD } },
    { address: 'A6', formula: 'Side A:', properties: { backgroundColor: '#8e8efb' } },
    { address: 'B6', formula: '5', properties: { backgroundColor: '#8e8efb' } },
    { address: 'A7', formula: 'Side B:', properties: { backgroundColor: '#8e8efb' } },
    { address: 'B7', formula: '10', properties: { backgroundColor: '#8e8efb' } },
    { address: 'A8', formula: 'Area:', properties: { backgroundColor: '#8e8efb', fontWeight: FontWeight.BOLD } },
    { address: 'B8', formula: '=B6*B7', properties: { backgroundColor: '#8e8efb', fontWeight: FontWeight.BOLD } },
    { address: 'A9', formula: 'Circle', properties: { backgroundColor: '#ff7afb', fontWeight: FontWeight.BOLD } },
    { address: 'A10', formula: 'Radius:', properties: { backgroundColor: '#ff7afb' } },
    { address: 'B10', formula: '5', properties: { backgroundColor: '#ff7afb' } },
    { address: 'A11', formula: 'Area:', properties: { backgroundColor: '#ff7afb', fontWeight: FontWeight.BOLD } },
    { address: 'B11', formula: '=Math.round(Math.PI * Math.pow(B10, 2))', properties: { backgroundColor: '#ff7afb', fontWeight: FontWeight.BOLD } },
  ],
  numberOfColumns: 8,
  numberOfRows: 20,
}