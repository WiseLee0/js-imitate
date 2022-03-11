import ASTNode from "../parser/ast/ASTNode";
import Factor from "../parser/ast/Factor";

export default class ExpressUtils {
  static toPostfix(node: ASTNode): string {
    if (node instanceof Factor) {
      return node.getLexeme()!.getValue();
    }

    const ans = [];
    for (const child of node.getChildren()) {
      ans.push(ExpressUtils.toPostfix(child));
    }
    if (!node.getLexeme()) {
      return `${ans.join(" ")}`;
    }
    return `${ans.join(" ")} ${node.getLexeme()?.getValue()}`;
  }
}
