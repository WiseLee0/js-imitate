import { TokenIterator } from "../../utils/TokenIterator";
import { ASTNodeType } from "./ASTNode";
import Expr from "./Expr";
import Factor from "./Factor";
import Stmt from "./Stmt";

export default class DeclareStmt extends Stmt {
  constructor() {
    super(ASTNodeType.DECLARE_STMT, "declare_stmt");
  }
  // let a = 2
  // tree:
  //    =
  //  a   2
  static parse(it: TokenIterator) {
    const declareStmt = new DeclareStmt();
    it.consume("let");
    const factor = Factor.parse(it);
    if (factor === undefined) {
      throw new Error("declare stmt parse error");
    }
    // left
    declareStmt.addChildren(factor);
    // mid
    const midNode = it.consume("=");
    declareStmt.setLexeme(midNode);
    // right
    declareStmt.addChildren(Expr.parse(it));
    return declareStmt;
  }
}

module.exports = DeclareStmt;
