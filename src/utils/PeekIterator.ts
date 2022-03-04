export default class PeekIterator {
  private it: Generator;
  private stack: any[] = [];
  private cache: any[] = [];
  private endToken?: string;
  private cacheSize = 10;
  constructor(it: Generator, endToken?: string) {
    this.it = it;
    this.endToken = endToken;
  }
  next() {
    if (this.cache.length) {
      const val = this.cache.pop();
      this.stack.push(val);
      return val;
    }
    let val = this.it.next().value;
    if (val === undefined) {
      val = this.endToken;
    }
    this.stack.push(val);
    return val;
  }
  peek() {
    const val = this.next();
    this.putBack();
    return val;
  }
  putBack() {
    if (this.stack.length) {
      const val = this.stack.pop();
      this.cache.push(val);
    }
  }
  hasNext() {
    return this.endToken || !!this.peek();
  }
}
