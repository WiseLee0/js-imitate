export default class RegularHelper {
  static isNumber(str: string) {
    return /^\d$/.test(str);
  }
  static isOperator(str: string) {
    return /^[+\-*/><=!&|^%,;]$/.test(str);
  }
  static isWord(str: string) {
    return /^[a-zA-Z]$/.test(str);
  }
  static isKeyVar(str: string) {
    return /^[_a-zA-Z0-9]$/.test(str);
  }
}
