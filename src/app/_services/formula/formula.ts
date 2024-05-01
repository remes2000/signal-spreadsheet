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

    let script = this.formula;
    const references = this.getReferences();
    references.forEach((cell) => {
      const value = cellValueMap.get(cell).value();
      script = new Formula(script).replaceCell(cell, `${value === '' ? 0 : value}`);
    });
    script = script.slice(1);
    console.log(`Executing script: ${script}`);
    return eval(script);
  }

  getReferences(): string[] {
    if (!this.formula.startsWith('=')) {
      return [];
    }
    return [...this.formula.matchAll(this.cellAddressRegExp)].map((match) => match[0]);
  }

  replaceCell(cell: string, replacement: string): string {
    const newFormula = this.formula;
    return newFormula.replace(new RegExp(`(?<![A-Z])${cell}(?![0-9])`, 'g'), replacement);
  } 
}
