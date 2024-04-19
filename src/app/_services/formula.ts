import { Signal } from '@angular/core';

export class Formula {
  private readonly cellAddressRegExp = new RegExp('[A-Z]+[0-9]+', 'g');

  constructor(
    private readonly formula: string,
    private readonly cellValueMap: Map<string, Signal<unknown>>
  ) {}

  execute() {
    let script = '';
    let previousMatch = {
      0: '',
      index: 0,
    };
    for (const match of this.formula.matchAll(this.cellAddressRegExp)) {
      script += this.formula.slice(previousMatch.index + previousMatch[0].length, match.index) + this.cellValueMap.get(match[0])();
      previousMatch = { 0: match[0], index: match.index };
    }
    console.log('script', script);
    return eval(script);
  }
}
