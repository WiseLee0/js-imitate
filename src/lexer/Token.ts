import Exception from "../utils/Exception";
import PeekIterator from "../utils/PeekIterator";
import RegularHelper from "../utils/RegularHelper";

export enum TokenType {
  KEYWORD,
  VARIABLE,
  OPERATOR,
  BRACKET,
  STRING,
  BOOLEAN,
  NUMBER,
}
const tokenKeyWord = new Set([
  "let",
  "if",
  "else",
  "for",
  "while",
  "break",
  "function",
  "return",
  "number",
  "boolean",
  "string",
]);

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
      this.type === TokenType.STRING
    );
  }

  // 匹配字符串
  static matchString(it: PeekIterator) {
    let state = 0;
    let ans = "";
    while (it.hasNext()) {
      const char = it.next();
      ans += char;
      switch (state) {
        case 0:
          if (char === "'") state = 1;
          if (char === '"') state = 2;
          break;
        case 1:
          if (char === "'") return new Token(TokenType.STRING, ans);
          break;
        case 2:
          if (char === '"') return new Token(TokenType.STRING, ans);
          break;
      }
    }
    Exception.msg("Unexpected error");
  }

  // 匹配数字
  static matchNumber(it: PeekIterator) {
    let state = 0;
    let ans = "";
    while (it.hasNext()) {
      const char = it.peek();
      switch (state) {
        case 0:
          if (char === "0") state = 1;
          else if (char === "+" || char === "-") state = 2;
          else if (RegularHelper.isNumber(char)) state = 3;
          else if (char === ".") state = 4;
          break;
        case 1:
          if (char === "0") state = 1;
          else if (RegularHelper.isNumber(char)) state = 3;
          else if (char === ".") state = 4;
          else {
            return new Token(TokenType.NUMBER, ans);
          }
        case 2:
          if (char === "0") state = 1;
          else if (RegularHelper.isNumber(char)) state = 3;
          else if (char === ".") state = 4;
          else {
            Exception.tokenCharacter(char);
          }
          break;
        case 3:
          if (char === ".") state = 4;
          else if (RegularHelper.isNumber(char)) state = 3;
          else {
            return new Token(TokenType.NUMBER, ans);
          }
          break;
        case 4:
          if (RegularHelper.isNumber(char)) state = 5;
          else {
            Exception.tokenCharacter(char);
          }
          break;
        case 5:
          if (RegularHelper.isNumber(char)) state = 5;
          else {
            return new Token(TokenType.NUMBER, ans);
          }
          break;
      }
      ans += char;
      it.next();
    }
    Exception.msg("Unexpected error");
  }

  // 匹配关键字或者变量
  static matchKeyVar(it: PeekIterator) {
    let state = 0;
    let ans = "";
    while (it.hasNext()) {
      const char = it.peek();
      switch (state) {
        case 0:
          if (RegularHelper.isKeyVar(char)) state = 1;
          break;
        case 1:
          if (RegularHelper.isKeyVar(char)) state = 1;
          else if (tokenKeyWord.has(ans)) {
            return new Token(TokenType.KEYWORD, ans);
          } else if (ans === "true" || ans === "false") {
            return new Token(TokenType.BOOLEAN, ans);
          } else {
            return new Token(TokenType.VARIABLE, ans);
          }
          break;
      }
      ans += char;
      it.next();
    }
    Exception.msg("Unexpected error");
  }

  // 匹配操作符
  static matchOperate(it: PeekIterator) {
    let state = 0;
    let ans = "";
    while (it.hasNext()) {
      const lookahead = it.next();
      switch (state) {
        case 0:
          switch (lookahead) {
            case "+":
              state = 1;
              break;
            case "-":
              state = 2;
              break;
            case "*":
              state = 3;
              break;
            case "/":
              state = 4;
              break;
            case ">":
              state = 5;
              break;
            case "<":
              state = 6;
              break;
            case "=":
              state = 7;
              break;
            case "!":
              state = 8;
              break;
            case "&":
              state = 9;
              break;
            case "|":
              state = 10;
              break;
            case "^":
              state = 11;
              break;
            case "%":
              state = 12;
              break;
            case ",":
              return new Token(TokenType.OPERATOR, ",");
            case ";":
              return new Token(TokenType.OPERATOR, ";");
          }
          break;
        case 1:
          if (lookahead === "+") {
            return new Token(TokenType.OPERATOR, "++");
          } else if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "+=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "+");
          }
        case 2:
          if (lookahead === "-") {
            return new Token(TokenType.OPERATOR, "--");
          } else if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "-=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "-");
          }
        case 3:
          if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "*=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "*");
          }
        case 4:
          if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "/=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "/");
          }
        case 5:
          if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, ">=");
          } else if (lookahead === ">") {
            return new Token(TokenType.OPERATOR, ">>");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, ">");
          }
        case 6:
          if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "<=");
          } else if (lookahead === "<") {
            return new Token(TokenType.OPERATOR, "<<");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "<");
          }
        case 7:
          if (lookahead === "=") {
            if (it.peek() === "=") {
              it.next();
              return new Token(TokenType.OPERATOR, "===");
            }
            return new Token(TokenType.OPERATOR, "==");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "=");
          }
        case 8:
          if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "!=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "!");
          }
        case 9:
          if (lookahead === "&") {
            return new Token(TokenType.OPERATOR, "&&");
          } else if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "&=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "&");
          }
        case 10:
          if (lookahead === "|") {
            return new Token(TokenType.OPERATOR, "||");
          } else if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "|=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "|");
          }
        case 11:
          if (lookahead === "^") {
            return new Token(TokenType.OPERATOR, "^^");
          } else if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "^=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "^");
          }
        case 12:
          if (lookahead === "=") {
            return new Token(TokenType.OPERATOR, "%=");
          } else {
            it.putBack();
            return new Token(TokenType.OPERATOR, "%");
          }
      }
    }
    Exception.msg("Unexpected error");
  }

  getType() {
    return this.type;
  }
  getValue() {
    return this.value;
  }
}
