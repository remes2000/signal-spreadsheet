import { Column } from "./column";

export class Address {
  constructor(private readonly value: string) {}

  getColumn(): string {
    return this.value.match(new RegExp('^[A-Z]+'))[0];
  }

  getRow(): number {
    return +this.value.match(new RegExp('[0-9]+$'))[0];
  }

  getNeighbor(direction: 'up' | 'right' | 'down' | 'left'): string {
    const column = this.getColumn();
    const row = this.getRow();

    if (direction === 'up') {
      return row > 0 ? `${column}${row - 1}` : null;
    }
    if (direction === 'down') {
      return `${column}${row + 1}`;
    }
    if (direction === 'left') {
      const previousColumn = new Column(column).getPrevious();
      return previousColumn ? `${previousColumn}${row}` : null;
    }

    return `${new Column(column).getNext()}${row}`;
  }

  move([top, left]: number[]): string {
    const currentColumnNumber = new Column(this.getColumn()).getNumber();
    const currentRowNumber = this.getRow();

    const columnNumber = currentColumnNumber + left;
    const rowNumber = currentRowNumber + top;

    return `${new Column(columnNumber).getAlias()}${rowNumber}`;
  }
}
