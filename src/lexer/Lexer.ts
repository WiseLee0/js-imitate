import Exception from "../utils/Exception";
import PeekIterator from "../utils/PeekIterator";
import RegularHelper from "../utils/RegularHelper";
import Token, { TokenType } from "./Token";

export default class Lexer {
  static run(sourceIt: Generator) {
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
}
