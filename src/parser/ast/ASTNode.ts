import Token from "../../lexer/Token";

export enum ASTNodeType {
  BLOCK,
  BINARY_EXPR, // 1+1
  UNARY_EXPR, // ++i
  CALL_EXPR,
  VARIABLE,
  CALCULATE, // 1.0, true
  IF_STMT,
  WHILE_STMT,
  FOR_STMT,
  RETURN_STMT,
  ASSIGN_STMT,
  FUNCTION_STMT,
  DECLARE_STMT,
}

export default class ASTNode {
  protected type?: ASTNodeType;
  protected children: ASTNode[] = [];
  protected parent?: ASTNode;
  protected lexeme?: Token;
  protected describe?: string;

  constructor(type?: ASTNode["type"], describe?: ASTNode["describe"]) {
    this.type = type;
    this.describe = describe;
  }

  getType() {
    return this.type;
  }
  getChildren() {
    return this.children;
  }
  getChildrenIndex(index: number) {
    return this.children[index];
  }
  getLexeme() {
    return this.lexeme;
  }
  getDescribe() {
    return this.describe;
  }
  getParent() {
    return this.parent;
  }
}
