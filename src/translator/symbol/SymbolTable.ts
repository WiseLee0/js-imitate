import Token, { TokenType } from "../../lexer/Token";
import CalculateSymbol from "./CalculateSymbol";
import LabelSymbol from "./LabelSymbol";
import Symbol from "./Symbol";
import VariableSymbol from "./VariableSymbol";

export default class SymbolTable {
  protected parent?: SymbolTable;
  protected children: Symbol[] = [];
  protected links: SymbolTable[] = [];
  protected level = 0; // 层级
  protected offset = 0; // variable offset
  protected tempIndex = 0; // 中间变量

  // 添加符号
  private addSymbol(symbol: SymbolTable["children"][number]) {
    this.children.push(symbol);
    symbol.setParent(this);
  }

  // 符号表，父级链上是否存在
  isExist(lexeme: Token): boolean {
    const symbol = this.children.find(
      (item) => item.getLexeme()?.getValue() === lexeme.getValue()
    );
    if (symbol) return true;
    if (this.parent) {
      return this.parent?.isExist(lexeme);
    }
    return false;
  }

  // 使用父级链上的变量
  findParentVariable(lexeme: Token, level: number): VariableSymbol | undefined {
    let symbol = this.children.find(
      (item) => item.getLexeme()?.getValue() === lexeme.getValue()
    ) as VariableSymbol;
    if (symbol?.parentLevel !== undefined) {
      const cloneSymbol = symbol.clone();
      cloneSymbol.setParentLevel(level);
      return cloneSymbol;
    }
    if (this.parent) {
      return this.parent?.findParentVariable(lexeme, level + 1);
    }
    return undefined;
  }

  addCalculateSymbol(lexeme: Token) {
    const symbol = new CalculateSymbol();
    symbol.setLexeme(lexeme);
    this.addSymbol(symbol);
    return symbol;
  }
  addVariableSymbol(lexeme: Token) {
    let symbol: VariableSymbol | LabelSymbol;
    const variableSymbol = this.findParentVariable(lexeme, 0);
    if (variableSymbol) {
      symbol = variableSymbol;
    } else {
      symbol = new VariableSymbol(this.offset);
      symbol.setLexeme(lexeme);
      this.offset++;
    }
    this.addSymbol(symbol);
    return symbol;
  }

  addTempVariableSymbol() {
    const lexeme = new Token(TokenType.VARIABLE, "p" + this.tempIndex++);
    const symbol = new VariableSymbol(this.offset);
    symbol.setLexeme(lexeme);
    this.offset++;
    this.addSymbol(symbol);
    return symbol;
  }

  addLabelSymbol(lexeme: Token, label: string) {
    const symbol = new LabelSymbol(lexeme, label);
    this.addSymbol(symbol);
  }

  addLink(symbolTable: SymbolTable) {
    symbolTable.parent = this;
    this.links?.push(symbolTable);
  }
  getChildren() {
    return this.children;
  }
  setParent(parent: SymbolTable) {
    this.parent = parent;
  }
  getParent() {
    return this.parent;
  }
  getOffset() {
    return this.offset;
  }
  getLevel() {
    return this.level;
  }
}
