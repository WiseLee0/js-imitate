export default class PeekIterator<T = string> {
  private it: Generator;
  private queue: T[] = [];
  private cache: any[] = [];
  private endToken?: string;
  private cacheSize = 10;
  constructor(it: Generator<T>, endToken?: string) {
    this.it = it;
    this.endToken = endToken;
  }
  next(): T {
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
  peek(): T {
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
  hasNext(): boolean {
    return Boolean(this.endToken) || !!this.peek();
  }
}
