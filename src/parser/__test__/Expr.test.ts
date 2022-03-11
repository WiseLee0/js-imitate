import { assert } from "chai";
import Lexer from "../../lexer/Lexer";
import ExpressUtils from "../../utils/ExpressUtils";
import GeneratorUtils from "../../utils/GenerateUtils";
import { TokenIterator } from "../../utils/TokenIterator";
import Expr from "../ast/Expr";

function exprPostfix(str: string) {
  const gen = GeneratorUtils.run(str);
  const tokens = Lexer.run(gen);
  const it = new TokenIterator(GeneratorUtils.run(tokens));
  const astNode = Expr.parse(it);
  return ExpressUtils.toPostfix(astNode);
}
describe("Expression", () => {
  it("simple", () => {
    assert.equal(exprPostfix("1+2+3"), "1 2 3 + +");
    assert.equal(exprPostfix("1-2+3"), "1 2 3 + -");
    assert.equal(exprPostfix("1+2+3*4"), "1 2 3 4 * + +");
    assert.equal(exprPostfix("1+2+3*4/5"), "1 2 3 4 5 / * + +");
    assert.equal(exprPostfix("1+2*3"), "1 2 3 * +");
    assert.equal(exprPostfix("1*2+3"), "1 2 * 3 +");
  });
  it("complex", () => {
    assert.equal(exprPostfix("1 * (2 + 3)"), "1 2 3 + *");
    assert.equal(exprPostfix("(1*2!=7)==3!=4*5+6"), "1 2 * 7 != 3 4 5 * 6 + != ==");
  });
});
