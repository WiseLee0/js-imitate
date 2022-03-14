import { TokenIterator } from "../../utils/TokenIterator";
import { ASTNodeType } from "./ASTNode";
import BlockStmt from "./BlockStmt";
import Factor from "./Factor";
import FunctionArgs from "./FunctionArgs";
import Stmt from "./Stmt";

export default class FunctionStmt extends Stmt {
  constructor() {
    super(ASTNodeType.FUNCTION_STMT, "function_stmt");
  }
  // function fn(...args) block
  parse(it: TokenIterator) {
    const functionStmt = new FunctionStmt();
    it.consume("function");
    const name = Factor.parse(it);
    if (!name) {
      throw new Error("function stmt parse error");
    }
    functionStmt.setLexeme(name.getLexeme());
    it.consume("(");
    const args = FunctionArgs.parse(it);
    functionStmt.addChildren(args);
    it.consume(")");
    functionStmt.addChildren(BlockStmt.parse(it));
    return functionStmt;
  }
}
