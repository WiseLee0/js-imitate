import Token, { TokenType } from "../lexer/Token";
import ASTNode, { ASTNodeType } from "../parser/ast/ASTNode";
import Expr from "../parser/ast/Expr";
import FunctionStmt from "../parser/ast/FunctionStmt";
import IfStmt from "../parser/ast/IfStmt";
import ReturnStmt from "../parser/ast/ReturnStmt";
import Symbol from "./symbol/Symbol";
import SymbolTable from "./symbol/SymbolTable";
import TAInstruction, { TAInstructionType } from "./TAInstruction";
import TAProgram from "./TAProgram";

export default class Translator {
  translate(astNode: ASTNode) {
    const program = new TAProgram();
    const symbolTable = new SymbolTable();
    for (const child of astNode.getChildren()) {
      this.translateStmt(program, child, symbolTable);
    }
    program.setStaticSymbolTable(symbolTable);
    return program;
  }
  translateStmt(program: TAProgram, ast: ASTNode, symbolTable: SymbolTable) {
    switch (ast.getType()) {
      case ASTNodeType.ASSIGN_STMT:
        this.translateAssignStmt(program, ast, symbolTable);
        return;
      case ASTNodeType.DECLARE_STMT:
        this.translateAssignStmt(program, ast, symbolTable);
        return;
      case ASTNodeType.BLOCK_STMT:
        this.translateBlockStmt(program, ast, symbolTable);
        return;
      case ASTNodeType.IF_STMT:
        this.translateIfStmt(program, ast as IfStmt, symbolTable);
        return;
      case ASTNodeType.FUNCTION_STMT:
        this.translateFunctionStmt(program, ast as FunctionStmt, symbolTable);
        return;
      case ASTNodeType.RETURN_STMT:
        this.translateReturnStmt(program, ast as ReturnStmt, symbolTable);
        return;
      case ASTNodeType.CALL_EXPR:
        this.translateCallExpr(program, ast, symbolTable);
        return;
      default:
        break;
    }
    throw new Error(`Translator error: ${ast.getType()}`);
  }
  translateCallExpr(
    program: TAProgram,
    node: ASTNode,
    symbolTable: SymbolTable
  ) {
    const returnValue = symbolTable.addTempVariableSymbol();
    symbolTable.addTempVariableSymbol();
    for (let i = 0; i < node.getChildren().length; i++) {
      const arg = node.getChildrenIdx(i);
      const argName = this.translateExpr(program, arg, symbolTable);
      program.addInstruction(
        new TAInstruction(
          TAInstructionType.PARAM,
          undefined,
          undefined,
          argName,
          `${i}`
        )
      );
    }
    program.addInstruction(
      new TAInstruction(
        TAInstructionType.SP,
        undefined,
        undefined,
        `${-symbolTable.getOffset()}`
      )
    );
    const funcName = symbolTable.findParentVariable(node.getLexeme()!, 0);
    program.addInstruction(
      new TAInstruction(
        TAInstructionType.CALL,
        undefined,
        undefined,
        funcName?.getLexeme()?.getValue()
      )
    );
    program.addInstruction(
      new TAInstruction(
        TAInstructionType.SP,
        undefined,
        undefined,
        `${symbolTable.getOffset()}`
      )
    );
    return returnValue;
  }
  translateReturnStmt(
    program: TAProgram,
    node: ReturnStmt,
    symbolTable: SymbolTable
  ) {
    const resultValue = this.translateExpr(
      program,
      node.getChildrenIdx(0),
      symbolTable
    );
    program.addInstruction(
      new TAInstruction(
        TAInstructionType.RETURN,
        undefined,
        undefined,
        resultValue
      )
    );
  }
  translateFunctionStmt(
    program: TAProgram,
    node: FunctionStmt,
    parent: SymbolTable
  ) {
    const label = program.addLabel();
    const symbolTable = new SymbolTable();
    parent.addLink(symbolTable);
    label.setArg2(node.getLexeme()!.getValue());
    const args = node.getArgs();
    symbolTable.addLabelSymbol(node.getLexeme()!, label.getArg1());
    for (const arg of args.getChildren()) {
      symbolTable.addVariableSymbol(arg.getLexeme()!);
    }
    for (const child of node.getBlock().getChildren()) {
      this.translateStmt(program, child, symbolTable);
    }
  }
  translateIfStmt(program: TAProgram, node: IfStmt, symbolTable: SymbolTable) {
    const expr = node.getJudgeExpr();
    const arg1 = this.translateExpr(program, expr, symbolTable);
    const instruction = new TAInstruction(
      TAInstructionType.IF,
      undefined,
      undefined,
      arg1
    );
    let endLabel: TAInstruction;
    program.addInstruction(instruction);
    this.translateBlockStmt(program, node.getIfStmt(), symbolTable);

    let gotoIns: TAInstruction;
    if (node.getChildrenIdx(2)) {
      gotoIns = new TAInstruction(TAInstructionType.GOTO);
      program.addInstruction(gotoIns);
      const elseBegin = program.addLabel();
      instruction.setArg2(elseBegin.getArg1());
    }

    if (node.getElseStmt()) {
      this.translateBlockStmt(program, node.getElseStmt()!, symbolTable);
    } else if (node.getElseIfStmt()) {
      this.translateIfStmt(program, node.getElseIfStmt()!, symbolTable);
    }
    // 第一种 if(){}
    // if block1 else End
    // block1
    // End:
    // 第二种 if(){}else{}
    // if block1 else block2
    // block1
    // Goto End
    // block2
    // End:
    // 第三种 if(){}else if{}
    endLabel = program.addLabel();
    if (node.getChildrenIdx(2)) gotoIns!.setArg1(endLabel);
    else instruction.setArg2(endLabel.getArg1());
  }
  translateBlockStmt(program: TAProgram, ast: ASTNode, parent: SymbolTable) {
    const symbolTable = new SymbolTable();
    parent.addLink(symbolTable);

    const parentOffset = symbolTable.addTempVariableSymbol();
    parentOffset.setLexeme(
      new Token(TokenType.NUMBER, parent.getOffset().toString())
    );

    program.addInstruction(
      new TAInstruction(
        TAInstructionType.SP,
        undefined,
        undefined,
        `${-parent.getOffset()}`
      )
    );

    for (const child of ast.getChildren()) {
      this.translateStmt(program, child, symbolTable);
    }

    program.addInstruction(
      new TAInstruction(
        TAInstructionType.SP,
        undefined,
        undefined,
        `${parent.getOffset()}`
      )
    );
  }
  translateAssignStmt(
    program: TAProgram,
    ast: ASTNode,
    symbolTable: SymbolTable
  ) {
    const node = ast.getChildrenIdx(0);
    const variable = symbolTable.addVariableSymbol(node.getLexeme()!);
    const expr = ast.getChildrenIdx(1);
    const exprResult = this.translateExpr(program, expr, symbolTable);
    program.addInstruction(
      new TAInstruction(TAInstructionType.ASSIGN, variable, "=", exprResult)
    );
  }
  /**
   * Expr -> Expr1 op Expr2
   *  T: result = Expr1.val op Expr2.val
   * Expr1 -> Factor
   *  T: Expr1.val = symbolTable.find(val)
   */
  translateExpr(program: TAProgram, node: ASTNode, symbolTable: SymbolTable) {
    if (node.getType() === ASTNodeType.VARIABLE) {
      const variable = symbolTable.addVariableSymbol(node.getLexeme()!);
      node.setProp("factor", variable);
      return variable;
    }
    if (node.getType() === ASTNodeType.CALCULATE) {
      const calculate = symbolTable.addCalculateSymbol(node.getLexeme()!);
      node.setProp("factor", calculate);
      return calculate;
    }
    if (node.getType() === ASTNodeType.CALL_EXPR) {
      const argName = this.translateCallExpr(program, node, symbolTable);
      node.setProp("factor", argName);
      return argName;
    }
    if (node instanceof Expr) {
      for (const child of node.getChildren()) {
        this.translateExpr(program, child, symbolTable);
      }
      if (!node.getProp("factor")) {
        node.setProp("factor", symbolTable.addTempVariableSymbol());
      }
      const instruction = new TAInstruction(
        TAInstructionType.ASSIGN,
        node.getProp("factor") as Symbol,
        node.getLexeme()!.getValue(),
        node.getChildrenIdx(0).getProp("factor") as Symbol,
        node.getChildrenIdx(1).getProp("factor") as Symbol
      );
      program.addInstruction(instruction);
      return instruction.getResult();
    }
    throw new Error("Unexpected node type :" + node.getType());
  }
}
function getSymbolValue(symbol: Symbol) {
  return symbol.getLexeme()?.getValue();
}
