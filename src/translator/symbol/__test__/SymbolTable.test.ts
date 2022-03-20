import { assert } from "chai";
import Token, { TokenType } from "../../../lexer/Token";
import SymbolTable from "../SymbolTable";

describe("SymbolTable", () => {
  it("simple", () => {
    const symbolTable = new SymbolTable();
    symbolTable.addLabelSymbol(new Token(TokenType.VARIABLE, "foo"), "L0");
    symbolTable.addTempVariableSymbol();
    symbolTable.addVariableSymbol(new Token(TokenType.VARIABLE, "foo"));
    assert.equal(symbolTable.getOffset(), 1);
  });
  it("chain", () => {
    const symbolTable = new SymbolTable();
    symbolTable.addVariableSymbol(new Token(TokenType.VARIABLE, "a"));

    const childTable = new SymbolTable();
    symbolTable.addLink(childTable);

    const childChildTable = new SymbolTable();
    childTable.addLink(childChildTable);
    assert.equal(
      childChildTable.isExist(new Token(TokenType.VARIABLE, "a")),
      true
    );
    assert.equal(childTable.isExist(new Token(TokenType.VARIABLE, "a")), true);
  });

  it("offset", () => {
    const symbolTable = new SymbolTable();

    symbolTable.addCalculateSymbol(new Token(TokenType.NUMBER, "100"));
    const symbolA = symbolTable.addVariableSymbol(
      new Token(TokenType.VARIABLE, "a")
    );
    const symbolB = symbolTable.addVariableSymbol(
      new Token(TokenType.VARIABLE, "b")
    );

    const childTable = new SymbolTable();
    symbolTable.addLink(childTable);
    const anotherSymbolB = childTable.addVariableSymbol(
      new Token(TokenType.VARIABLE, "b")
    );
    var symbolC = childTable.addVariableSymbol(
      new Token(TokenType.VARIABLE, "c")
    );

    assert.equal(symbolA.getOffset(), 0);
    assert.equal(symbolB.getOffset(), 1);
    assert.equal(anotherSymbolB.getOffset(), 1);
    assert.equal(anotherSymbolB.getParentLevel(), 1);
    assert.equal(symbolC.getOffset(), 0);
    assert.equal(symbolC.getParentLevel(), 0);
  });
});
