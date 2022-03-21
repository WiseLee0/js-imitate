import TAInstruction, { TAInstructionType } from "../translator/TAInstruction";
import TAProgram from "../translator/TAProgram";
import Instruction from "./Instruction";
import OpCodeProgram from "./OpcodeProgram";
import Symbol from "../translator/symbol/Symbol";
import Register from "./operand/Register";
import OpCode from "./Opcode";

export default class OpCodeGen {
  run(taProgram: TAProgram) {
    const program = new OpCodeProgram();
    const taInstructions = taProgram.getInstructions();
    for (const taInstruction of taInstructions) {
      program.addComment(taInstruction.toString());
      switch (taInstruction.getType()) {
        case TAInstructionType.ASSIGN:
          this.genCopy(program, taInstruction);
          break;
      }
    }
    return program;
  }
  genCopy(program: OpCodeProgram, taInstruction: TAInstruction) {
    const result = taInstruction.getResult();
    const op = taInstruction.getOp();
    const arg1 = taInstruction?.getArg1() as Symbol;
    const arg2 = taInstruction?.getArg2() as Symbol;
    if (arg2 === undefined) {
      program.addInstruction(Instruction.loadToRegister(Register.S0, arg1));
      program.addInstruction(Instruction.saveToMemory(Register.S0, result));
    } else {
      program.addInstruction(Instruction.loadToRegister(Register.S0, arg1));
      program.addInstruction(Instruction.loadToRegister(Register.S1, arg2));
      switch (op) {
        case "+":
          program.addInstruction(
            Instruction.register(
              OpCode.ADD,
              Register.S2,
              Register.S0,
              Register.S1
            )
          );
          break;
        case "-":
          program.addInstruction(
            Instruction.register(
              OpCode.SUB,
              Register.S2,
              Register.S0,
              Register.S1
            )
          );
          break;
        case "*":
          program.addInstruction(
            Instruction.register(OpCode.MULT, Register.S0, Register.S1)
          );
          program.addInstruction(
            Instruction.register(OpCode.MFLO, Register.S2)
          );
          break;
        case "==":
        case "===":
          program.addInstruction(
            Instruction.register(
              OpCode.EQ,
              Register.S2,
              Register.S1,
              Register.S0
            )
          );
          break;
      }
      program.addInstruction(Instruction.saveToMemory(Register.S2, result));
    }
  }
}
