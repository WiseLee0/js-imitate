import Token from "../../lexer/Token";
import Symbol, { SymbolType } from "./Symbol";

export default class LabelSymbol extends Symbol {
  private label: string;
  constructor(lexeme: Token, label: string) {
    super(SymbolType.LABEL_SYMBOL, "label_symbol");
    this.lexeme = lexeme;
    this.label = label;
  }
  clone() {
    const symbol = new LabelSymbol(this.lexeme!, this.label);
    symbol.type = this.type;
    return symbol;
  }
  getLabel() {
    return this.label;
  }
}
