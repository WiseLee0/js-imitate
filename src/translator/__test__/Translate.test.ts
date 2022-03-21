import path from "path";
import Parser from "../../parser/Parser";
import GeneratorUtils from "../../utils/GenerateUtils";
import SymbolTable from "../symbol/SymbolTable";
import TAProgram from "../TAProgram";
import Translator from "../Translator";

const { assert } = require("chai");

describe("Translate", () => {
  //        +
  //    a        +
  //        p0       *
  //            d        *
  //                 p1      2
  it("exprStmt", () => {
    const source = "a+(b-c)+d*(e+f)*2";
    const it = GeneratorUtils.run(source);
    const p = Parser.run(it);
    const exprNode = p.getChildrenIdx(0);
    const translator = new Translator();
    const symbolTable = new SymbolTable();
    const program = new TAProgram();
    translator.translateExpr(program, exprNode, symbolTable);

    const expected = `p0 = b - c
p1 = e + f
p2 = p1 * 2
p3 = d * p2
p4 = p0 + p3
p5 = a + p4`;

    assert.equal(program.toString(), expected);
  });
  it("assignStmt", () => {
    const source = "a=1.0*2.0*3.0";
    const it = GeneratorUtils.run(source);
    const astNode = Parser.run(it);
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();

    const expected = `p0 = 2.0 * 3.0
p1 = 1.0 * p0
a = p1`;
    assert.equal(code, expected);
  });

  it("declareStmt", () => {
    const source = "let a=1.0*2.0*3.0";
    const it = GeneratorUtils.run(source);
    const astNode = Parser.run(it);
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();
    const expected = `p0 = 2.0 * 3.0
p1 = 1.0 * p0
a = p1`;
    assert.equal(code, expected);
  });

  it("blockStmt", () => {
    const source = `
    let a = 1
    {
      let b = a + 2
    }
    {
      let c = a + 3 
    }`;
    const it = GeneratorUtils.run(source);
    const astNode = Parser.run(it);
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();
    const expected = `a = 1
SP -1
p1 = a + 2
b = p1
SP 1
SP -1
p1 = a + 3
c = p1
SP 1`;
    assert.equal(expected, code);
  });

  it("blockStmtDeep", () => {
    const source = `
    let a = 1
    {
      let b =  2
      {
        let c = a + 3
      }
    }
    {
      let d = a + 3 
    }`;
    const it = GeneratorUtils.run(source);
    const astNode = Parser.run(it);
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();
    const expected = `a = 1
SP -1
b = 2
SP -2
p1 = a + 3
c = p1
SP 2
SP 1
SP -1
p1 = a + 3
d = p1
SP 1`;
    assert.equal(expected, code);
  });

  it("ifStmt", () => {
    const source = `if(flag){
       let a = 1 + 2
    }`;
    const it = GeneratorUtils.run(source);
    const astNode = Parser.run(it);
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();
    const expected = `IF flag ELSE L0
SP -1
p1 = 1 + 2
a = p1
SP 1
L0:`;
    assert.equal(expected, code);
  });
  it("ifElseStmt", () => {
    const source = `if(flag){
       let a = 1 + 2
    } else {
       let b = 3 + 4
    }`;
    const it = GeneratorUtils.run(source);
    const astNode = Parser.run(it);
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();
    const expected = `IF flag ELSE L0
SP -1
p1 = 1 + 2
a = p1
SP 1
GOTO L1:
L0:
SP -1
p1 = 3 + 4
b = p1
SP 1
L1:`;
    assert.equal(expected, code);
  });

  it("ifElseIfStmt", () => {
    const source = `if(a == 1) {
      b = 100
    } else if(a == 2) {
      b = 500
    } else if(a == 3) {
      b = a * 1000
    } else {
      b = -1
    }`;
    const it = GeneratorUtils.run(source);
    const astNode = Parser.run(it);
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();
    const expected = `p0 = a == 1
IF p0 ELSE L0
SP -2
b = 100
SP 2
GOTO L5:
L0:
p1 = a == 2
IF p1 ELSE L1
SP -3
b = 500
SP 3
GOTO L4:
L1:
p2 = a == 3
IF p2 ELSE L2
SP -4
p1 = a * 1000
b = p1
SP 4
GOTO L3:
L2:
SP -4
b = -1
SP 4
L3:
L4:
L5:`;
    assert.equal(expected, code);
  });
  it("functionStmt", () => {
    const astNode = Parser.run(path.resolve(__dirname, "./file/fun1.txt"));
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();
    const expected = `L0:
a = 2
p0 = a + b
RETURN p0`;
    assert.equal(expected, code);
  });
  it("functionStmtDeep", () => {
    const astNode = Parser.run(path.resolve(__dirname, "./file/fun2.txt"));
    const translator = new Translator();
    const program = translator.translate(astNode);
    const code = program.toString();
    const expected = `L0:
p0 = k === 0
IF p0 ELSE L1
SP -2
RETURN 1
SP 2
L1:
p3 = k - 1
PARAM p3 0
SP -5
CALL test
SP 5
p4 = p1 * k
RETURN p4`;
    assert.equal(expected, code);
  });
});
