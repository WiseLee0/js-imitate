import { TokenIterator } from "../../utils/TokenIterator";
import AssignStmt from "./AssignStmt";
import ASTNode from "./ASTNode";
import BlockStmt from "./BlockStmt";
import DeclareStmt from "./DeclareStmt";
import Expr from "./Expr";
import FunctionStmt from "./FunctionStmt";
import IfStmt from "./IfStmt";
import ReturnStmt from "./ReturnStmt";

export default class Stmt extends ASTNode {
  static parse(it: TokenIterator) {
    const stmt = new Stmt();
    if (!it.hasNext()) {
      return undefined;
    }
    const cur = it.next();
    const curVal = cur.getValue();
    const nextVal = it.peek().getValue();
    it.putBack();

    if (curVal === "let") {
      return DeclareStmt.parse(it);
    } else if (curVal === "if") {
      return IfStmt.parse(it);
    } else if (cur.isVariable() && nextVal === "=") {
      return AssignStmt.parse(it);
    } else if (curVal === "function") {
      return FunctionStmt.parse(it);
    } else if (curVal === "return") {
      return ReturnStmt.parse(it);
    } else if (curVal === "{") {
      return BlockStmt.parse(it);
    } else {
      return Expr.parse(it);
    }
  }
}
