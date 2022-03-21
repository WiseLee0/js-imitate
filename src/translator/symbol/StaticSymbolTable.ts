import CalculateSymbol from "./CalculateSymbol";

export default class StaticSymbolTable {
  private map = new Map<string, CalculateSymbol>();
  private offset = 0;

  add(symbolTable: CalculateSymbol) {
    const key = symbolTable.getLexeme()?.getValue();
    if (!key) {
      throw new Error("StaticSymbol add error");
    }
    if (this.map.has(key)) {
      const table = this.map.get(key)!;
      symbolTable.setOffset(table.getOffset());
    } else {
      symbolTable.setOffset(this.offset);
      this.map.set(key, symbolTable);
      this.offset++;
    }
  }

  toString() {
    let ans = "";
    for (const value of this.getCalculate()) {
      ans += `${value} `;
    }
    return ans.slice(0, -1);
  }

  getCalculate() {
    return this.map.keys();
  }

  getSymbolTables() {
    return this.map.values();
  }
}
