export default class Exception extends Error {
  static tokenCharacter(char: string) {
    throw new Exception(`Unexpect character: ${char}`);
  }
  static msg(msg: string) {
    throw new Exception(msg);
  }
}
