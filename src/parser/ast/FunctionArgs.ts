import { TokenIterator } from "../../utils/TokenIterator";
import ASTNode, { ASTNodeType } from "./ASTNode";
import Factor from "./Factor";

export default class FunctionArgs extends ASTNode {
  static parse(it: TokenIterator) {
    const functionArgs = new FunctionArgs(
      ASTNodeType.FUNCTION_ARGS,
      "function_args"
    );
    let factor: ReturnType<typeof Factor.parse>;
    while ((factor = Factor.parse(it)) && it.peek().getValue() === ",") {
      it.consume(",");
      functionArgs.addChildren(factor);
    }
    return functionArgs;
  }
}
