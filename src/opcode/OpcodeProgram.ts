import Instruction from "./Instruction";

export default class OpCodeProgram {
  instructions: Instruction[] = [];
  commentMap = new Map<number, string>();
  addComment(comment: string) {
    this.commentMap.set(this.instructions.length, comment);
  }
  addInstruction(instruction: Instruction) {
    this.instructions.push(instruction);
  }
  toString() {
    const ans = [];
    for (let i = 0; i < this.instructions.length; i++) {
      const instruction = this.instructions[i];
      if (this.commentMap.has(i)) {
        ans.push(`# ${this.commentMap.get(i)}`);
      }
      ans.push(instruction.toString());
    }
    return ans.join("\n");
  }
}
