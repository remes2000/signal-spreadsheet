import { Pipe, PipeTransform } from '@angular/core';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Pipe({
  name: 'columnAlias',
  standalone: true
})
export class ColumnAliasPipe implements PipeTransform {
  transform(value: number): string {
    const res = LETTERS[value % LETTERS.length];
    return value >= LETTERS.length ? this.transform(Math.floor(value / LETTERS.length) - 1) + res : res;
  }
}