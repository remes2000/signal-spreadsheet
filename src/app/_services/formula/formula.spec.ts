import { Formula } from "./formula";

describe('Replace cell references in formula', () => {
  const testCases = [
    { formula: '=A2+B2+A2', replace: 'A2', replacement: 'C30', expected: '=C30+B2+C30' },
    { formula: '=B1+B10', replace: 'B1', replacement: 'A3', expected: '=A3+B10' },
    { formula: '=A1+AA1', replace: 'A1', replacement: 'B2', expected: '=B2+AA1' }
  ];

  testCases.forEach(({ formula, replace, replacement, expected }) => {
    it(`Formula '${formula}' should be '${expected}' when ${replace} -> ${replacement}`, () => {
      const result = new Formula(formula).replaceCell(replace, replacement);
      expect(result).toBe(expected);
    });
  });
});