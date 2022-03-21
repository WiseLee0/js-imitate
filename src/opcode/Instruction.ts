import Opcode from "./Opcode";
import Operand from "./operand/Operand";
import Register from "./operand/Register";
import Symbol, { SymbolType } from "../translator/symbol/Symbol";
import OpCode from "./Opcode";
import Offset from "./operand/Offset";
import VariableSymbol from "../translator/symbol/VariableSymbol";
import CalculateSymbol from "../translator/symbol/CalculateSymbol";
export default class Instruction {
  MASK_OPCODE = 0xfc000000;
  MASK_R0 = 0x03e00000;
  MASK_R1 = 0x001f0000;
  MASK_R2 = 0x0000f800;
  MASK_OFFSET0 = 0x03ffffff;
  MASK_OFFSET1 = 0x001fffff;
  MASK_OFFSET2 = 0x000007ff;
  opList: Operand[] = [];
  code: Opcode;
  constructor(code: Opcode) {
    this.code = code;
  }

  static loadToRegister(target: Register, arg: Symbol) {
    if (arg.getType() == SymbolType.VARIABLE_SYMBOL) {
      return Instruction.offsetInstruction(
        OpCode.LW,
        target,
        Register.SP,
        new Offset(-(arg as VariableSymbol).getOffset())
      );
    } else if (arg.getType() == SymbolType.CALCULATE_SYMBOL) {
      return Instruction.offsetInstruction(
        OpCode.LW,
        target,
        Register.STATIC,
        new Offset((arg as CalculateSymbol).getOffset())
      );
    }
    throw new Error("loadToRegister error");
  }
  static saveToMemory(source: Register, arg: Symbol) {
    return Instruction.offsetInstruction(
      OpCode.SW,
      source,
      Register.SP,
      new Offset(-(arg as VariableSymbol | CalculateSymbol).getOffset())
    );
  }

  static offsetInstruction(
    code: OpCode,
    r1: Register,
    r2: Register,
    offset: Offset
  ) {
    const instruction = new Instruction(code);
    instruction.opList.push(r1);
    instruction.opList.push(r2);
    instruction.opList.push(offset);
    return instruction;
  }

  static register(code: OpCode, r1: Register, r2?: Register, r3?: Register) {
    const instruction = new Instruction(code);
    instruction.opList.push(r1);
    r2 && instruction.opList.push(r2);
    r3 && instruction.opList.push(r3);
    return instruction;
  }

  toString() {
    const ans = [];
    const codeName = this.code.getName();
    for (const opcode of this.opList) {
      ans.push(opcode.toString());
    }
    return `${codeName} ${ans.join(' ')}`
  }
}
