import { assert } from "chai";
import Lexer from "../../lexer/Lexer";
import { TokenType } from "../../lexer/Token";
import ExpressUtils from "../../utils/ExpressUtils";
import GeneratorUtils from "../../utils/GenerateUtils";
import { TokenIterator } from "../../utils/TokenIterator";
import AssignStmt from "../ast/AssignStmt";
import DeclareStmt from "../ast/DeclareStmt";
import FunctionStmt from "../ast/FunctionStmt";
import IfStmt from "../ast/IfStmt";

function createToken(str: string) {
  const tokens = Lexer.run(GeneratorUtils.run(str));
  const tokenIt = new TokenIterator(GeneratorUtils.run(tokens));
  return tokenIt;
}

describe("Stmt", () => {
  it("declare", () => {
    const it = createToken("let i = 100 * 2");
    const stmt = DeclareStmt.parse(it);
    assert.equal("i 100 2 * =", ExpressUtils.toPostfix(stmt));
  });
  it("assign", () => {
    const it = createToken("i = 100 * 2");
    const stmt = AssignStmt.parse(it);
    assert.equal("i 100 2 * =", ExpressUtils.toPostfix(stmt));
  });

  it("if", () => {
    const it = createToken(`
        if(true) {
            let i = 100 * 2
        }
    `);
    const stmt = IfStmt.parse(it);
    assert.equal(stmt.getChildrenIdx(0).getLexeme()?.getValue(), "true");
    assert.equal(
      stmt.getChildrenIdx(0).getLexeme()?.getType(),
      TokenType.BOOLEAN
    );
    assert.equal("i 100 2 * =", ExpressUtils.toPostfix(stmt.getChildrenIdx(1)));
  });
  it("if-else", () => {
    const it = createToken(`
        if(false) {
          let a = 100 * 2
        } else {
          let b = 1 + 2
          b = 3
        }
    `);
    const stmt = IfStmt.parse(it);
    assert.equal(stmt.getChildrenIdx(0).getLexeme()?.getValue(), "false");
    assert.equal(
      stmt.getChildrenIdx(0).getLexeme()?.getType(),
      TokenType.BOOLEAN
    );
    assert.equal("a 100 2 * =", ExpressUtils.toPostfix(stmt.getChildrenIdx(1)));
    assert.equal(
      "b 1 2 + =",
      ExpressUtils.toPostfix(stmt.getChildrenIdx(2).getChildrenIdx(0))
    );
    assert.equal(
      "b 3 =",
      ExpressUtils.toPostfix(stmt.getChildrenIdx(2).getChildrenIdx(1))
    );
  });

  it("function", () => {
    const it = createToken(`
       function test(a, b) {
          a = 2
          return a + b
       }
    `);
    const stmt = FunctionStmt.parse(it);

    assert.equal(stmt.getLexeme()?.getValue(), "test");
    assert.equal(stmt.getLexeme()?.getType(), TokenType.VARIABLE);
    const args = stmt.getChildrenIdx(0);
    assert.equal(args.getChildrenIdx(0).getLexeme()?.getValue(), "a");
    assert.equal(args.getChildrenIdx(1).getLexeme()?.getValue(), "b");
    const block = stmt.getChildrenIdx(1);
    assert.equal("a 2 =", ExpressUtils.toPostfix(block.getChildrenIdx(0)));
    assert.equal("return", block.getChildrenIdx(1).getLexeme()?.getValue());
    assert.equal(
      "a b +",
      ExpressUtils.toPostfix(block.getChildrenIdx(1).getChildrenIdx(0))
    );
  });
});
