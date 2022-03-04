export enum TokenType {
  KEYWORD,
  VARIABLE,
  OPERATOR,
  BRACKET,
  STIRNG,
  BOOLEAN,
  NUMBER,
}
export enum TokenKeyWord {
  LET = "let",
  IF = "if",
  ELSE = "else",
  FOR = "for",
  WHILE = "while",
  BREAK = "break",
  FUNCTION = "function",
  RETURN = "return",
  NUMBER = "number",
  BOOLEAN = "boolean",
  STRING = "string",
}

export default class Token {
  private type: TokenType;
  private value: string;
  constructor(type: Token["type"], value: Token["value"]) {
    this.type = type;
    this.value = value;
  }

  // 变量
  isVariable() {
    return this.type === TokenType.VARIABLE;
  }

  // 值类型
  isValueType() {
    return (
      this.type === TokenType.BOOLEAN ||
      this.type === TokenType.NUMBER ||
      this.type === TokenType.STIRNG
    );
  }

  getType() {
    return this.type;
  }
  getValue() {
    return this.value;
  }
}
