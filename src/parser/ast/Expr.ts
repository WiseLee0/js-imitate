import { TokenIterator } from "../../utils/TokenIterator";
import ASTNode, { ASTNodeType } from "./ASTNode";
import Factor from "./Factor";

const operateTable = [
  ["&", "|", "^"],
  ["===", "==", "!=", ">", "<", ">=", "<="],
  ["+", "-"],
  ["*", "/"],
  ["<<", ">>"],
];
// 1 + 2 * 3

// E(k) = E(k) op(k) E(k+1) | E(k+1)
// 消除左递归
// E(K) = E(k+1)E_(k)
// E_(k) = op(k)E(k+1)E_(k) | F
export default class Expr extends ASTNode {
  E(it: TokenIterator, k: number): any {
    if (k === operateTable.length) {
      return this.OR(
        it,
        () => this.FactorExpr(it),
        () => this.UnaryExpr(it)
      );
    } else {
      return this.Combine(
        it,
        () => this.E(it, k + 1),
        () => this.E_(it, k)
      );
    }
  }
  E_(it: TokenIterator, k: number) {
    const token = it.peek();
    const value = token.getValue();
    if (operateTable[k - 1].includes(value)) {
      it.consume(value);
      const expr = new Expr(ASTNodeType.BINARY_EXPR, value);
      expr.setLexeme(token);
      expr.addChildren(
        this.Combine(
          it,
          () => this.E(it, k + 1),
          () => this.E_(it, k)
        )
      );
      return expr;
    }
    return undefined;
  }
  // number | variable | call_expr | undefined
  FactorExpr(it: TokenIterator) {
    const factor = Factor.parse(it);
    if (factor === undefined) {
      return undefined;
    }
    if (it.hasNext() && it.peek().getValue() === "(") {
      it.putBack();
      return CallExpr.parse(it);
    }
    return factor;
  }
  // unary_expr ++2 --2 !true (2)
  UnaryExpr(it: TokenIterator) {
    const cur = it.peek().getValue();
    if (cur === "(") {
      it.consume("(");
      const unaryExpr = Expr.parse(it);
      it.consume(")");
      return unaryExpr;
    }
    if (cur === "++" || cur === "--" || cur === "!") {
      const unaryExpr = new Expr(ASTNodeType.UNARY_EXPR, cur);
      it.consume(cur);
      const leftNode = Expr.parse(it)!;
      unaryExpr.addChildren(leftNode);
      return unaryExpr;
    }
    return undefined;
  }
  Combine(it: TokenIterator, funcA: Function, funcB: Function) {
    if (!it.hasNext()) return undefined;
    const resA = funcA(it);
    if (resA === undefined) return undefined;
    if (!it.hasNext()) return resA;
    const resB = funcB(it) as Expr;
    if (resB === undefined) return resA;
    // 根节点：OP(K)
    const binaryExpr = new Expr(ASTNodeType.BINARY_EXPR, resB.getDescribe());
    binaryExpr.setLexeme(resB.getLexeme());
    // 左节点：E(K)
    binaryExpr.addChildren(resA);
    // 右节点：E(k+1)E_(k)
    binaryExpr.addChildren(resB.getChildrenIdx(0));
    return binaryExpr;
  }
  OR(it: TokenIterator, funcA: Function, funcB: Function) {
    if (!it.hasNext()) return undefined;
    return funcA() || funcB();
  }
  static parse(it: TokenIterator) {
    const expr = new Expr();
    return expr.E(it, 1);
  }
}

class CallExpr extends Expr {
  constructor() {
    super(ASTNodeType.CALL_EXPR, "call_expr");
  }
  static parse(it: TokenIterator) {
    const callExpr = new CallExpr();
    const callName = it.next();
    callExpr.setLexeme(callName);
    it.consume("(");
    let p: Expr | undefined;
    while ((p = Expr.parse(it)) !== undefined) {
      callExpr.addChildren(p);
      if (it.peek().getValue() !== ")") {
        it.consume(",");
      } else {
        it.consume(")");
        break;
      }
    }
    return callExpr;
  }
}
