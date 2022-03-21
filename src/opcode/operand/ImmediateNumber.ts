import Operand from "./Operand";

export default class ImmediateNumber extends Operand {
  value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  toString(): string {
    return this.value.toString();
  }
}
