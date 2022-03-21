export enum AddressType {
  IMMEDIATE,
  REGISTER,
  JUMP,
  BRANCH,
  OFFSET,
}

export default class OpCode {
  type: AddressType;
  name: string;
  value: number;
  static opcodes: OpCode[] = [];
  constructor(type: AddressType, name: string, value: number) {
    this.type = type;
    this.name = name;
    this.value = value;
    OpCode.opcodes[value] = this;
  }
  static ADD = new OpCode(AddressType.REGISTER, "ADD", 0x01);
  static SUB = new OpCode(AddressType.REGISTER, "SUB", 0x02);
  static MULT = new OpCode(AddressType.REGISTER, "MULT", 0x03);
  static ADDI = new OpCode(AddressType.IMMEDIATE, "ADDI", 0x05);
  static SUBI = new OpCode(AddressType.IMMEDIATE, "SUBI", 0x06);
  static MULTI = new OpCode(AddressType.IMMEDIATE, "MULTI", 0x07);
  static MFLO = new OpCode(AddressType.REGISTER, "MFLO", 0x08);
  static EQ = new OpCode(AddressType.REGISTER, "EQ", 0x09);
  static BNE = new OpCode(AddressType.OFFSET, "BNE", 0x15);
  static SW = new OpCode(AddressType.OFFSET, "SW", 0x10);
  static LW = new OpCode(AddressType.OFFSET, "LW", 0x11);
  static JUMP = new OpCode(AddressType.JUMP, "JUMP", 0x20);
  static JR = new OpCode(AddressType.JUMP, "JR", 0x21);
  static RETURN = new OpCode(AddressType.JUMP, "RETURN", 0x22);
  fromByte(value: number) {
    return OpCode.opcodes[value];
  }
  getType() {
    return this.type;
  }
  getValue() {
    return this.value;
  }
  getName() {
    return this.name;
  }
}
