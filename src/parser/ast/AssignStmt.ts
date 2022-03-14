import { TokenIterator } from "../../utils/TokenIterator";
import { ASTNodeType } from "./ASTNode";
import Expr from "./Expr";
import Factor from "./Factor";
import Stmt from "./Stmt";

export default class AssignStmt extends Stmt {
  constructor() {
    super(ASTNodeType.ASSIGN_STMT, "assign_stmt");
  }
  // a = 1
  // tree:
  //     =
  //   a   1
  static parse(it: TokenIterator) {
    const assignStmt = new AssignStmt();
    const factor = Factor.parse(it);
    if (factor === undefined) {
      throw new Error("assign_stmt parse error");
    }
    // left
    assignStmt.addChildren(factor);
    // mid
    const mid = it.consume("=");
    assignStmt.setLexeme(mid);
    // right
    assignStmt.addChildren(Expr.parse(it));
    return assignStmt;
  }
}

module.exports = AssignStmt;
