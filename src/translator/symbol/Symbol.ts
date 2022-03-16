import Token from "../../lexer/Token";
import SymbolTable from "./SymbolTable";

export enum SymbolType {
  VARIABLE_SYMBOL,
  LABEL_SYMBOL,
  CALCULATE_SYMBOL,
}
export default class Symbol {
  protected type: SymbolType;
  protected describe?: string;
  protected lexeme?: Token;
  protected parent?: SymbolTable;
  constructor(type: Symbol["type"], describe?: Symbol["describe"]) {
    this.type = type;
    this.describe = describe;
  }
  getType() {
    return this.type;
  }
  getDescribe() {
    return this.describe;
  }
  setLexeme(lexeme: Symbol["lexeme"]) {
    this.lexeme = lexeme;
  }
  getLexeme() {
    return this.lexeme;
  }
  setParent(symbolTable: SymbolTable) {
    this.parent = symbolTable;
  }
  getParent() {
    return this.parent;
  }
}
