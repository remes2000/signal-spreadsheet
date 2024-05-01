import { CellMapEntry } from '../../_interfaces';

export class Formula {
  private readonly cellAddressRegExp = new RegExp('[A-Z]+[0-9]+', 'g');

  constructor(private readonly formula: string) {}

  execute(cellValueMap: Map<string, CellMapEntry>) {
    if (this.formula === '') {
      return '';
    }

    if (!this.formula.startsWith('=')) {
      return !isNaN(+this.formula) ? +this.formula : this.formula;
    }


    // (1) używamy evala, trzeba zamienić referencje na wywołania syngałów
    let script = this.formula;
    const references = this.getReferences();
    references.forEach((cell) => {
      const value = cellValueMap.get(cell).value();
      script = script.replace(new RegExp(cell, 'g'), `${value === '' ? 0 : value}`);
    });
    console.log('script', script);

    // const formula = this.formula.slice(1);
    // let script = '';
    // let previousMatch = {
    //   0: '',
    //   index: 0,
    // };
    // for (const match of formula.matchAll(this.cellAddressRegExp)) {
    //   script += formula.slice(previousMatch.index + previousMatch[0].length, match.index) + cellValueMap.get(match[0]).value();
    //   previousMatch = { 0: match[0], index: match.index };
    // }
    // console.log('script', script);
    // return eval(script);
    return null;
  }

  getReferences(): string[] {
    if (!this.formula.startsWith('=')) {
      return [];
    }
    return [...this.formula.matchAll(this.cellAddressRegExp)].map((match) => match[0]);
  }

  replaceCell(cell: string, replacement: string): string {
    const newFormula = this.formula;
    return newFormula;
  } 
}
