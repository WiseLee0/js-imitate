import Token, { TokenType } from "../lexer/Token";
import Exception from "./Exception";
import PeekIterator from "./PeekIterator";

export class TokenIterator extends PeekIterator<Token> {
  constructor(tokens: Generator<Token>) {
    super(tokens);
  }
  twinTypeMatch(cur: TokenType, next: TokenType) {
    const curVal = this.next()?.getType();
    const nextVal = this.peek()?.getType();
    if (cur === curVal && nextVal === next) {
      this.putBack();
      return true;
    }
    this.putBack();
    return false;
  }
  consume(value: string) {
    const currentToken = this.next();
    if (currentToken.getValue() !== value) {
      Exception.tokenCharacter(value);
    }
  }
}
