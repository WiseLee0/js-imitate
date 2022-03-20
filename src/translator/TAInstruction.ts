export enum TAInstructionType {
  ASSIGN,
  GOTO,
  IF,
  LABEL,
  CALL,
  RETURN,
  SP,
  PARAM,
  FUNC_BEGIN,
}
export default class TAInstruction {
  private type: TAInstructionType;
  private result?: any;
  private op?: any;
  private arg1?: any;
  private arg2?: any;
  constructor(
    type: TAInstructionType,
    result?: string,
    op?: string,
    arg1?: string,
    arg2?: string
  ) {
    this.type = type;
    this.result = result;
    this.op = op;
    this.arg1 = arg1;
    this.arg2 = arg2;
  }
  toString() {
    switch (this.type) {
      case TAInstructionType.ASSIGN:
        if (this.arg2) {
          return `${this.result} = ${this.arg1} ${this.op} ${this.arg2}`;
        } else {
          return `${this.result} = ${this.arg1}`;
        }
      case TAInstructionType.IF:
        return `IF ${this.arg1} ELSE ${this.arg2}`;
      case TAInstructionType.GOTO:
        return `GOTO ${this.arg1}`;
      case TAInstructionType.LABEL:
        return `${this.arg1}:`;
      case TAInstructionType.RETURN:
        return `RETURN ${this.arg1}`;
      case TAInstructionType.PARAM:
        return `PARAM ${this.arg1} ${this.arg2}`;
      case TAInstructionType.SP:
        return `SP ${this.arg1}`;
      case TAInstructionType.CALL:
        return `CALL ${this.arg1}`;
    }
    throw new Error("Unknown opcode type:" + this.type);
  }

  getResult() {
    return this.result;
  }

  setArg1(arg: TAInstruction["arg1"]) {
    this.arg1 = arg;
  }

  getArg1() {
    return this.arg1;
  }

  setArg2(arg: TAInstruction["arg2"]) {
    this.arg2 = arg;
  }

  getArg2() {
    return this.arg2;
  }

  setResult(result: TAInstruction["result"]) {
    this.result = result;
  }

  getType() {
    return this.type;
  }

  getOp() {
    return this.op;
  }
}
