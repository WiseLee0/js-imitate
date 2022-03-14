import { TokenIterator } from "../../utils/TokenIterator";
import { ASTNodeType } from "./ASTNode";
import BlockStmt from "./BlockStmt";
import Expr from "./Expr";
import Stmt from "./Stmt";

export default class IfStmt extends Stmt {
  constructor() {
    super(ASTNodeType.IF_STMT, "if_stmt");
  }
  // ifStmt => if(Expr) Block | if(Expr) Block else Block | if(Expr) Block else ifStmt
  // ifStmt => if(Expr) Block Term
  // Term => else Block | else ifStmt | null

  // if(expr) stmt else stmt
  // tree:
  //       if
  // expr  stmt  stmt
  static parse(it: TokenIterator) {
    const ifStmt = new IfStmt();
    const mid = it.consume("if");
    it.consume("(");
    // mid
    ifStmt.setLexeme(mid);
    // ifExpr
    ifStmt.addChildren(Expr.parse(it));
    it.consume(")");
    // ifStmt
    ifStmt.addChildren(BlockStmt.parse(it));
    // elseStmt
    const elseStmt = IfStmt.TermParse(it);
    if (elseStmt) {
      ifStmt.addChildren(elseStmt);
    }
    return ifStmt;
  }

  static TermParse(it: TokenIterator) {
    if (it.hasNext() && it.peek().getValue() === "else") {
      it.consume("else");
      const value = it.peek().getValue();
      if (value === "{") {
        return BlockStmt.parse(it);
      }
      if (value === "if") {
        return IfStmt.parse(it);
      }
    }
    return undefined;
  }
}
