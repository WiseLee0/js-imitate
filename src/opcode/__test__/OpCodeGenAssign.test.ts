import { assert } from "chai";
import Parser from "../../parser/Parser";
import Translator from "../../translator/Translator";
import OpCodeGen from "../OpCodeGen";

describe("OpCodeGenAssign", () => {
  it("basic", () => {
    const source = "let a = 1 * (2 + 3) - 4";
    const astNode = Parser.run(source, true);
    const translator = new Translator();
    const taProgram = translator.translate(astNode);
    const staticList = taProgram.getStaticSymbolTable().toString();
    assert.equal(staticList, "1 2 3 4");
    const gen = new OpCodeGen();
    const program = gen.run(taProgram);
    const ans = program.toString();
    const expected = `# p0 = 2 + 3
LW S0 STATIC 1
LW S1 STATIC 2
ADD S2 S0 S1
SW S2 SP -1
# p1 = 1 * p0
LW S0 STATIC 0
LW S1 SP -1
MULT S0 S1
MFLO S2
SW S2 SP -2
# p2 = p1 - 4
LW S0 SP -2
LW S1 STATIC 3
SUB S2 S0 S1
SW S2 SP -3
# a = p2
LW S0 SP -3
SW S0 SP 0`;
    assert.equal(expected, ans);
  });
});
