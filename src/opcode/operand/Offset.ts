import Operand from "./Operand";

export default class Offset extends Operand {
  offset: number;
  constructor(offset: number) {
    super();
    this.offset = offset;
  }
  getOffset() {
    return this.offset;
  }
  setOffset(offset: number) {
    this.offset = offset;
  }
  getEncodedOffset() {
    if (this.offset > 0) {
      return this.offset;
    }
    return 0x400 | -this.offset;
  }
  decodeOffset(offset: number) {
    if ((offset & 0x400) > 0) {
      offset = offset & 0x3ff;
      offset = -offset;
    }
    return new Offset(offset);
  }
  toString(): string {
    return this.offset.toString();
  }
}
