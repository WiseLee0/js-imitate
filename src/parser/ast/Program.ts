import { TokenIterator } from "../../utils/TokenIterator";
import ASTNode, { ASTNodeType } from "./ASTNode";
import Stmt from "./Stmt";

export default class Program extends ASTNode {
  static parse(it: TokenIterator) {
    const program = new Program(ASTNodeType.PROGRAM, "program");
    let stmt: ReturnType<typeof Stmt.parse>;
    while (Boolean((stmt = Stmt.parse(it)))) {
      program.addChildren(stmt);
    }
    return program;
  }
}
