import Symbol, { SymbolType } from "./Symbol";

export default class CalculateSymbol extends Symbol {
  protected offset = 0;
  constructor() {
    super(SymbolType.CALCULATE_SYMBOL, 'calculate_symbol');
  }
  setOffset(offset: number) {
    this.offset = offset;
  }
  getOffset() {
    return this.offset;
  }
}
