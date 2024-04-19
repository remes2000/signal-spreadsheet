const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const calculateAlias = (value: number): string => {
  const res = LETTERS[value % LETTERS.length];
  return value >= LETTERS.length ? calculateAlias(Math.floor(value / LETTERS.length) - 1) + res : res;
}
const calculateColumnNumber = (alias: string): number => {
  return alias.split('')
    .reverse()
    .reduce((acc, letter, index) => {
      return acc + Math.pow(LETTERS.length, index) * LETTERS.indexOf(letter);
    }, 0);
};

export class Column {
  private readonly alias: string;
  private readonly columnNumber: number;

  constructor(value: string | number) {
    this.alias = typeof value === 'number' ? calculateAlias(value) : value;
    this.columnNumber = typeof value === 'number' ? value : calculateColumnNumber(value);
  }

  getNext() {
    return calculateAlias(this.columnNumber + 1);
  }

  getPrevious() {
    return this.columnNumber > 0 ? calculateAlias(this.columnNumber - 1) : null;
  }

  getNumber() {
    return this.columnNumber;
  }

  getAlias() {
    return this.alias;
  }
}
