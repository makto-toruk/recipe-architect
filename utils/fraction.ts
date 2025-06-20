import Fraction from "fraction.js";

export function formatFraction(num: number, den: number): string {
  const f = new Fraction(num, den).simplify();
  return f.toFraction(true); // returns mixed-number string if needed
}

// And anywhere you need to add/multiply for sub-recipes:
export function addFractions(...facs: Fraction[]): Fraction {
  return facs.reduce((a, b) => a.add(b), new Fraction(0));
}
