import { assert } from "chai";
import Lexer from "../../lexer/Lexer";
import GeneratorUtils from "../../utils/GenerateUtils";
import { TokenIterator } from "../../utils/TokenIterator";
import AddExprDemo from "../AddExprDemo";

describe("AddExprDemo", () => {
  it("add", () => {
    const source = "1+2+3+4";
    const tokens = Lexer.run(GeneratorUtils.run(source));
    const it = new TokenIterator(GeneratorUtils.run(tokens));
    const expr = AddExprDemo.parse(it);

    assert.equal(expr.getChildren().length, 2);

    assert.equal(expr.getLexeme()!.getValue(), "+");
    const v1 = expr.getChildrenIdx(0);
    const e2 = expr.getChildrenIdx(1);
    assert.equal(v1.getLexeme()!.getValue(), "1");
    assert.equal(e2.getLexeme()!.getValue(), "+");
    const v2 = e2.getChildrenIdx(0);
    const e3 = e2.getChildrenIdx(1);
    assert.equal(v2.getLexeme()!.getValue(), "2");
    assert.equal(e3.getLexeme()!.getValue(), "+");
    const v3 = e3.getChildrenIdx(0);
    const v4 = e3.getChildrenIdx(1);
    assert.equal(v3.getLexeme()!.getValue(), "3");
    assert.equal(v4.getLexeme()!.getValue(), "4");
  });
});
