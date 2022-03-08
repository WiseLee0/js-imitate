import { TokenType } from "../lexer/Token";
import { TokenIterator } from "../utils/TokenIterator";
import Expr from "./ast/Expr";
import Factor from "./ast/Factor";

export default class AddExprDemo {
  // 1 + 2 + 3
  // expr = expr + num | num
  static parse(it: TokenIterator) {
    const expr = new Expr();
    if (it.twinTypeMatch(TokenType.NUMBER, TokenType.OPERATOR)) {
      // left
      const factor = Factor.parse(it);
      expr.addChildren(factor);
      // center
      const cur = it.peek();
      expr.setLexeme(cur);
      expr.setDescribe(cur.getValue());
      it.next();
      // right
      expr.addChildren(AddExprDemo.parse(it));
    } else {
      const factor = Factor.parse(it);
      return factor;
    }
    return expr;
  }
}
