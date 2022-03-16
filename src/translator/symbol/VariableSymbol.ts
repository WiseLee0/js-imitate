import Symbol, { SymbolType } from "./Symbol";

export default class VariableSymbol extends Symbol {
  offset = 0; // 变量之间的偏移
  parentLevel = 0; // 距离父层级偏移
  constructor(offset: number) {
    super(SymbolType.VARIABLE_SYMBOL, "variable_symbol");
    this.offset = offset;
  }
  clone() {
    const symbol = new VariableSymbol(this.offset);
    symbol.parentLevel = this.parentLevel;
    symbol.type = this.type;
    symbol.lexeme = this.lexeme;
    return symbol;
  }
  getOffset() {
    return this.offset;
  }
  setOffset(offset: number) {
    this.offset = offset;
  }
  setParentLevel(level: number) {
    this.parentLevel = level;
  }
  getParentLevel() {
    return this.parentLevel;
  }
}
