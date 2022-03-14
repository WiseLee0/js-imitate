import { TokenIterator } from "../../utils/TokenIterator";
import { ASTNodeType } from "./ASTNode";
import Stmt from "./Stmt";

export default class BlockStmt extends Stmt {
  constructor() {
    super(ASTNodeType.BLOCK_STMT, "block_stmt");
  }
  static parse(it: TokenIterator) {
    const blockStmt = new BlockStmt();
    let stmt: any;
    it.consume("{");
    while (it.peek().getValue() !== "}" && Boolean((stmt = Stmt.parse(it)))) {
      blockStmt.addChildren(stmt);
    }
    it.consume("}");
    return blockStmt;
  }
}
module.exports = BlockStmt;
