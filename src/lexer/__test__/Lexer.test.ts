import { assert } from "chai";
import GeneratorUtils from "../../utils/GenerateUtils";
import Lexer from "../lexer";
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
describe("Lexer", () => {
  it("expression", () => {
    const source = "(a + b) ^ 100.12 === +100 - 20";
    const it = GeneratorUtils.run(source);
    const tokens = Lexer.run(it);
    assert.equal(tokens.length, 11);
    assertToken(tokens[0], "(", TokenType.BRACKET);
    assertToken(tokens[1], "a", TokenType.VARIABLE);
    assertToken(tokens[2], "+", TokenType.OPERATOR);
    assertToken(tokens[3], "b", TokenType.VARIABLE);
    assertToken(tokens[4], ")", TokenType.BRACKET);
    assertToken(tokens[5], "^", TokenType.OPERATOR);
    assertToken(tokens[6], "100.12", TokenType.NUMBER);
    assertToken(tokens[7], "===", TokenType.OPERATOR);
    assertToken(tokens[8], "+100", TokenType.NUMBER);
    assertToken(tokens[9], "-", TokenType.OPERATOR);
    assertToken(tokens[10], "20", TokenType.NUMBER);
  });

  it("function", () => {
    const source = `
        function fn(a,b) {
            console(a+b)
        }
        fn(-1.0, 2)
    `;
    const it = GeneratorUtils.run(source);
    const tokens = Lexer.run(it);
    assertToken(tokens[0], "function", TokenType.KEYWORD);
    assertToken(tokens[1], "fn", TokenType.VARIABLE);
    assertToken(tokens[2], "(", TokenType.BRACKET);
    assertToken(tokens[3], "a", TokenType.VARIABLE);
    assertToken(tokens[4], ",", TokenType.OPERATOR);
    assertToken(tokens[5], "b", TokenType.VARIABLE);
    assertToken(tokens[6], ")", TokenType.BRACKET);
    assertToken(tokens[7], "{", TokenType.BRACKET);
    assertToken(tokens[8], "console", TokenType.VARIABLE);
    assertToken(tokens[9], "(", TokenType.BRACKET);
    assertToken(tokens[10], "a", TokenType.VARIABLE);
    assertToken(tokens[11], "+", TokenType.OPERATOR);
    assertToken(tokens[12], "b", TokenType.VARIABLE);
    assertToken(tokens[13], ")", TokenType.BRACKET);
    assertToken(tokens[14], "}", TokenType.BRACKET);
    assertToken(tokens[15], "fn", TokenType.VARIABLE);
    assertToken(tokens[16], "(", TokenType.BRACKET);
    assertToken(tokens[17], "-1.0", TokenType.NUMBER);
    assertToken(tokens[18], ",", TokenType.OPERATOR);
    assertToken(tokens[19], "2", TokenType.NUMBER);
    assertToken(tokens[20], ")", TokenType.BRACKET);
  });

  it("comment", () => {
    const source = `
        /**
         * 123124
         */ 
        let a = 1;
        // 123123
    `;
    const it = GeneratorUtils.run(source);
    const tokens = Lexer.run(it);
    assert.equal(5, tokens.length);
    assertToken(tokens[0], "let", TokenType.KEYWORD);
    assertToken(tokens[1], "a", TokenType.VARIABLE);
    assertToken(tokens[2], "=", TokenType.OPERATOR);
    assertToken(tokens[3], "1", TokenType.NUMBER);
    assertToken(tokens[4], ";", TokenType.OPERATOR);
  });
});
