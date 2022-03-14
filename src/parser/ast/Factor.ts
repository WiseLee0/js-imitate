import Token, { TokenType } from "../../lexer/Token";
import { TokenIterator } from "../../utils/TokenIterator";
import ASTNode, { ASTNodeType } from "./ASTNode";

export default class Factor extends ASTNode {
  constructor(it: Token) {
    super();
    this.lexeme = it;
    this.describe = it.getValue();
  }

  static parse(it: TokenIterator): Variable | Calculate | undefined {
    const token = it.peek();
    if (token.getType() === TokenType.VARIABLE) {
      it.next();
      return new Variable(token);
    }
    if (token.isValueType()) {
      it.next();
      return new Calculate(token);
    }
    return undefined;
  }
}
export class Variable extends Factor {
  constructor(it: Token) {
    super(it);
    this.type = ASTNodeType.VARIABLE;
  }
}

export class Calculate extends Factor {
  constructor(it: Token) {
    super(it);
    this.type = ASTNodeType.CALCULATE;
  }
}
