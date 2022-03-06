import { assert } from "chai";
import GeneratorUtils from "../../utils/GenerateUtils";
import PeekIterator from "../../utils/PeekIterator";
import Token, { TokenType } from "../Token";
const assertToken = (
  token: Token,
  value: Token["value"],
  type: Token["type"]
) => {
  console.log(token.getValue());
  assert.equal(token.getType(), type);
  assert.equal(token.getValue(), value);
};
describe("Token", () => {
  it("number", () => {
    const tests = [
      ["+1 + 2", "+1"],
      ["-1 + 2", "-1"],
      [".4211 + 2", ".4211"],
      [".5555+2", ".5555"],
      ["123.123-12312", "123.123"],
      ["100.12-1", "100.12"],
      ["-100-2132", "-100"],
      ["-123124.123*123123", "-123124.123"],
      ["012-3123", "012"],
    ];
    for (let test of tests) {
      const it = new PeekIterator(GeneratorUtils.run(test[0]));
      const token = Token.matchNumber(it)!;
      assertToken(token, test[1], TokenType.NUMBER);
    }
  });
  
  it("Variable and KeyWord", () => {
    const tests = [
      ["let a = 1", "let"],
      ["for()", "for"],
      ["function()", "function"],
      ["abc = 123", "abc"],
      ["_abc = 123", "_abc"],
      ["_qwe ", "_qwe"],
    ];
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const it = new PeekIterator(GeneratorUtils.run(test[0]));
      const token = Token.matchKeyVar(it)!;
      const type = i < 3 ? TokenType.KEYWORD : TokenType.VARIABLE;
      assertToken(token, test[1], type);
    }
  });

  it("string", () => {
    const tests = [
      ["'123' ", "'123'"],
      ["'' ", "''"],
      ['"213" ', '"213"'],
      ['"" ', '""'],
    ];
    for (let test of tests) {
      const it = new PeekIterator(GeneratorUtils.run(test[0]));
      const token = Token.matchString(it)!;
      assertToken(token, test[1], TokenType.STRING);
    }
  });

  it("operator", () => {
    const tests = [
      ["+ xxx", "+"],
      ["++mmm", "++"],
      ["/=g", "/="],
      ["==1", "=="],
      ["===1", "==="],
      ["&=3982", "&="],
      ["&777", "&"],
      ["||xx", "||"],
      ["^=111", "^="],
      ["%7", "%"],
    ];
    for (let test of tests) {
      const it = new PeekIterator(GeneratorUtils.run(test[0]));
      const token = Token.matchOperate(it)!;
      assertToken(token, test[1], TokenType.OPERATOR);
    }
  });
});
