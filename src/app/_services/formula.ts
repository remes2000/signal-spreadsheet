import { CellMapEntry } from '../_interfaces';

export class Formula {
  private readonly cellAddressRegExp = new RegExp('[A-Z]+[0-9]+', 'g');

  constructor(private readonly formula: string,) {}

  execute(cellValueMap: Map<string, CellMapEntry>) {
    if (this.formula === '') {
      return '';
    }

    if (!this.formula.startsWith('=')) {
      return !isNaN(+this.formula) ? +this.formula : this.formula;
    }

    const formula = this.formula.slice(1);
    let script = '';
    let previousMatch = {
      0: '',
      index: 0,
    };
    for (const match of formula.matchAll(this.cellAddressRegExp)) {
      script += formula.slice(previousMatch.index + previousMatch[0].length, match.index) + cellValueMap.get(match[0]).value();
      previousMatch = { 0: match[0], index: match.index };
    }
    return eval(script);
  }

  getReferences(): string[] {
    if (!this.formula.startsWith('=')) {
      return [];
    }
    return [...this.formula.matchAll(this.cellAddressRegExp)].map((match) => match[0]);
  }
}
