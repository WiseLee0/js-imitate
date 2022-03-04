export default class Exception extends Error {
  static laxer(char: string) {
    throw new Exception(`Unexpect character: ${char}`);
  }
}
