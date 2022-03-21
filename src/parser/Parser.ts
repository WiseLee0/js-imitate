import Lexer from "../lexer/Lexer";
import GeneratorUtils from "../utils/GenerateUtils";
import { TokenIterator } from "../utils/TokenIterator";
import Program from "./ast/Program";
export default class Parser {
  static run(source: Generator<string> | string, isText = false) {
    if (isText) {
      return Parser.parseText(source as string);
    }
    return Parser.parsePathOrIterator(source);
  }
  private static parseText(source: string) {
    const sourceIt = GeneratorUtils.run(source);
    const tokens = Lexer.run(sourceIt);
    const it = new TokenIterator(GeneratorUtils.run(tokens));
    return Program.parse(it);
  }
  private static parsePathOrIterator(source: Generator<string> | string) {
    const tokens = Lexer.run(source);
    const it = new TokenIterator(GeneratorUtils.run(tokens));
    return Program.parse(it);
  }
}
