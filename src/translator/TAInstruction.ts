import Symbol from "./symbol/Symbol";
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
    result?: any,
    op?: string,
    arg1?: any,
    arg2?: any
  ) {
    this.type = type;
    this.result = result;
    this.op = op;
    this.arg1 = arg1;
    this.arg2 = arg2;
  }
  toString() {
    const result = this.getSymbolValue(this.result);
    const op = this.getSymbolValue(this.op);
    const arg1 = this.getSymbolValue(this.arg1);
    const arg2 = this.getSymbolValue(this.arg2);

    switch (this.type) {
      case TAInstructionType.ASSIGN:
        if (arg2) {
          return `${result} = ${arg1} ${op} ${arg2}`;
        } else {
          return `${result} = ${arg1}`;
        }
      case TAInstructionType.IF:
        return `IF ${arg1} ELSE ${arg2}`;
      case TAInstructionType.GOTO:
        return `GOTO ${this.arg1}`;
      case TAInstructionType.LABEL:
        return `${this.arg1}:`;
      case TAInstructionType.RETURN:
        return `RETURN ${arg1}`;
      case TAInstructionType.PARAM:
        return `PARAM ${arg1} ${arg2}`;
      case TAInstructionType.SP:
        return `SP ${arg1}`;
      case TAInstructionType.CALL:
        return `CALL ${arg1}`;
    }
    throw new Error("Unknown opcode type:" + this.type);
  }

  getSymbolValue(symbol?: Symbol | string) {
    if (typeof symbol === "string") {
      return symbol;
    }
    if (symbol instanceof Symbol) {
      return symbol?.getLexeme()?.getValue();
    }
    return undefined;
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
