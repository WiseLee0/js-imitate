import { TokenIterator } from "../../utils/TokenIterator";
import ASTNode, { ASTNodeType } from "./ASTNode";
import Expr from "./Expr";

export default class ReturnStmt extends ASTNode {
  static parse(it: TokenIterator) {
    const returnStmt = new ReturnStmt(ASTNodeType.RETURN_STMT, "return_stmt");
    const returnLabel = it.consume("return");
    returnStmt.setLexeme(returnLabel);
    returnStmt.addChildren(Expr.parse(it));
    return returnStmt;
  }
}
