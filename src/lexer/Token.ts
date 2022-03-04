enum TokenType {
  KEYWORD,
  VARIABLE,
  OPERATOR,
  BRACKET,
  STIRNG,
  BOOLEAN,
  INTEGER,
  FLOAT,
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
      this.type === TokenType.INTEGER ||
      this.type === TokenType.STIRNG ||
      this.type === TokenType.FLOAT
    );
  }

  getType() {
    return this.type;
  }
  getValue() {
    return this.value;
  }
}
