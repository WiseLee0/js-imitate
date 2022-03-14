import { TokenIterator } from "../../utils/TokenIterator";
import ASTNode from "./ASTNode";
import Expr from "./Expr";

const runTimeExport = () => {
  const AssignStmt = require("./AssignStmt");
  const FunctionStmt = require("./FunctionStmt");
  const ReturnStmt = require("./ReturnStmt");
  const BlockStmt = require("./BlockStmt");
  const DeclareStmt = require("./DeclareStmt");
  const ForStmt = require("./ForStmt");
  const IfStmt = require("./IfStmt");
  return {
    AssignStmt,
    FunctionStmt,
    ReturnStmt,
    IfStmt,
    BlockStmt,
    ForStmt,
    DeclareStmt,
  };
};
export default class Stmt extends ASTNode {
  static parse(it: TokenIterator) {
    const {
      AssignStmt,
      FunctionStmt,
      ReturnStmt,
      BlockStmt,
      DeclareStmt,
      IfStmt,
    } = runTimeExport();
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
