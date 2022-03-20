import Lexer from "../lexer/Lexer";
import GeneratorUtils from "../utils/GenerateUtils";
import { TokenIterator } from "../utils/TokenIterator";
import Program from "./ast/Program";
export default class Parser {
  static run(source: Generator<string> | string) {
    const tokens = Lexer.run(source);
    const it = new TokenIterator(GeneratorUtils.run(tokens));
    return Program.parse(it);
  }
}
