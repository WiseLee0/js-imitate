import Token, { TokenType } from "../lexer/Token";
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
}
