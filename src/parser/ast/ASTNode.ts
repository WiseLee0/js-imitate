import Token from "../../lexer/Token";

export enum ASTNodeType {
  BLOCK_STMT,
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
  FUNCTION_ARGS,
  PROGRAM
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

  setType(type: ASTNode["type"]) {
    this.type = type;
  }
  getType() {
    return this.type;
  }
  addChildren(item: ASTNode["children"][number]) {
    this.children.push(item);
  }
  getChildren() {
    return this.children;
  }
  getChildrenIdx(index: number) {
    return this.children[index];
  }
  setLexeme(lexeme: ASTNode["lexeme"]) {
    this.lexeme = lexeme;
  }
  getLexeme() {
    return this.lexeme;
  }
  setDescribe(describe: ASTNode["describe"]) {
    this.describe = describe;
  }
  getDescribe() {
    return this.describe;
  }
  getParent() {
    return this.parent;
  }
}
