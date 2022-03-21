import Offset from "./Offset";

export default class Label extends Offset {
  label: string;
  constructor(label: string) {
    super(0);
    this.label = label;
  }
  getLabel() {
    return this.label;
  }
  toString(): string {
    return this.label;
  }
}
