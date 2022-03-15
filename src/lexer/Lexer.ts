import Exception from "../utils/Exception";
import PeekIterator from "../utils/PeekIterator";
import RegularHelper from "../utils/RegularHelper";
import Token, { TokenType } from "./Token";
import fs from "fs";
import GeneratorUtils from "../utils/GenerateUtils";
export default class Lexer {
  static parse(sourceIt: Generator<string>) {
    const END = "\0";
    const it = new PeekIterator(sourceIt, END);
    const tokens: Token[] = [];

    while (it.hasNext()) {
      const cur = it.next();
      const next = it.peek();
      if (cur === END) break;
      if (cur == " " || cur == "\n" || cur == "\r") {
        continue;
      }
      // 处理注释
      if (cur === "/") {
        // 单行注释
        if (next === "/") {
          while (it.hasNext() && it.next() !== "\n") {}
          continue;
        }
        // 多行注释
        if (it.hasNext() && next === "*") {
          it.next();
          if (it.peek() === "*") {
            let flag = false;
            while (it.hasNext()) {
              const cur = it.next();
              const next = it.peek();
              if (cur === "*" && next === "/") {
                it.next();
                flag = true;
                break;
              }
            }
            if (flag) continue;
            Exception.msg("comment not matched");
          }
          it.putBack();
        }
      }
      if (cur === "(" || cur === ")" || cur === "{" || cur === "}") {
        tokens.push(new Token(TokenType.BRACKET, cur));
        continue;
      }
      if (cur === '"' || cur === "'") {
        it.putBack();
        tokens.push(Token.matchString(it)!);
        continue;
      }
      if (RegularHelper.isWord(cur)) {
        it.putBack();
        tokens.push(Token.matchKeyVar(it)!);
        continue;
      }
      if (RegularHelper.isNumber(cur)) {
        it.putBack();
        tokens.push(Token.matchNumber(it)!);
        continue;
      }

      // 1 * +2
      // 1 + 2
      if ((cur === "+" || cur === "-") && RegularHelper.isNumber(next)) {
        const preToken = tokens[tokens.length - 1];
        if (!preToken?.isValueType()) {
          it.putBack();
          tokens.push(Token.matchNumber(it)!);
          continue;
        }
      }

      if (RegularHelper.isOperator(cur)) {
        it.putBack();
        tokens.push(Token.matchOperate(it)!);
        continue;
      }

      Exception.tokenCharacter(cur);
    }

    return tokens;
  }

  /**
   *
   * @param source 流 或者 文件路径
   * @returns
   */
  static run(source: Generator<string> | string) {
    if (typeof source === "string") {
      const content = fs.readFileSync(source, "utf-8");
      const it = GeneratorUtils.run(content);
      return Lexer.parse(it);
    }
    return Lexer.parse(source);
  }
}
