import Token from "../lexer/Token";
import PeekIterator from "./PeekIterator";

export class TokenIterator extends PeekIterator<Token> {
  constructor(tokens: Generator<Token>) {
    super(tokens);
  }
}
