export default class PeekIterator {
  private it: Generator;
  private queue: any[] = [];
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
      this.queue.push(val);
      return val;
    }
    let val = this.it.next().value;
    if (val === undefined) {
      val = this.endToken;
    }
    while (this.queue.length >= this.cacheSize) {
      this.queue.shift();
    }
    this.queue.push(val);
    return val;
  }
  peek() {
    const val = this.next();
    this.putBack();
    return val;
  }
  putBack() {
    if (this.queue.length) {
      const val = this.queue.pop();
      this.cache.push(val);
    }
  }
  hasNext() {
    return this.endToken || !!this.peek();
  }
}
