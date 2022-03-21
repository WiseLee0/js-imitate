import Operand from "./Operand";

export default class Register extends Operand {
  addr: number;
  name: string;
  static registers: Register[] = [];
  constructor(name: string, addr: number) {
    super();
    this.addr = addr;
    this.name = name;
    Register.registers[addr] = this;
  }
  static ZERO = new Register("ZERO", 1);
  static PC = new Register("PC", 2);
  static SP = new Register("SP", 3);
  static STATIC = new Register("STATIC", 4);
  static RA = new Register("RA", 5);

  static S0 = new Register("S0", 10);
  static S1 = new Register("S1", 11);
  static S2 = new Register("S2", 12);

  static L0 = new Register("L0", 20);

  static fromAddr(reg: number) {
    if (reg < 0 || reg >= Register.registers.length) {
      throw new Error("No Register's address is " + reg);
    }
    if (!Register.registers[reg]) {
      throw new Error("No Register's address is " + reg);
    }
    return Register.registers[reg];
  }

  getName() {
    return this.name;
  }
  getAddr() {
    return this.addr;
  }
  toString(): string {
    return this.name;
  }
}
