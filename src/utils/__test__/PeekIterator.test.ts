import { assert } from "chai";
import GeneratorUtils from "../GenerateUtils";
import PeekIterator from "../PeekIterator";
describe("PeekIterator", () => {
  it("peek next putBack test", () => {
    const it = GeneratorUtils.run("abc");
    const peekIt = new PeekIterator(it);
    assert.equal("a", peekIt.peek());
    assert.equal("a", peekIt.next());
    assert.equal("b", peekIt.peek());
    peekIt.putBack();
    assert.equal("a", peekIt.peek());
    assert.equal("a", peekIt.next());
    assert.equal("b", peekIt.peek());
    assert.equal("b", peekIt.next());
    assert.equal("c", peekIt.peek());
    peekIt.putBack();
    assert.equal("b", peekIt.peek());
    peekIt.putBack();
    assert.equal("a", peekIt.peek());
  });

  it("endToken test", () => {
    const testStr = "qwertyiuio";
    const it = GeneratorUtils.run(testStr);
    const peekIt = new PeekIterator(it, "\n");
    for (let i = 0; i <= testStr.length; i++) {
      if (i !== testStr.length) {
        assert.equal(testStr[i], peekIt.next());
      }else{
        assert.equal("\n", peekIt.peek());
      }
    }
  });
});
