import { assert } from "chai";
import RegularHelper from "../RegularHelper";

describe("RegularHelper", () => {
  it("test", () => {
    assert.equal(true, RegularHelper.isKeyVar("_"));
    assert.equal(true, RegularHelper.isKeyVar("2"));
    assert.equal(true, RegularHelper.isKeyVar("a"));
    assert.equal(true, RegularHelper.isKeyVar("W"));

    assert.equal(false, RegularHelper.isWord("_"));
    assert.equal(false, RegularHelper.isWord("2"));
    assert.equal(true, RegularHelper.isWord("a"));
    assert.equal(true, RegularHelper.isWord("W"));

    assert.equal(true, RegularHelper.isOperator("*"));
    assert.equal(true, RegularHelper.isOperator("+"));
    assert.equal(true, RegularHelper.isOperator("<"));
    assert.equal(true, RegularHelper.isOperator("&"));
    assert.equal(true, RegularHelper.isOperator("="));

    assert.equal(true, RegularHelper.isNumer("2"));
    assert.equal(false, RegularHelper.isNumer("q"));
  });
});
