import CalculateSymbol from "./symbol/CalculateSymbol";
import StaticSymbolTable from "./symbol/StaticSymbolTable";
import { SymbolType } from "./symbol/Symbol";
import SymbolTable from "./symbol/SymbolTable";
import TAInstruction, { TAInstructionType } from "./TAInstruction";

export default class TAProgram {
  instructions: TAInstruction[] = [];
  labelCounter: number = 0;
  staticSymbolTable = new StaticSymbolTable();
  addInstruction(instruction: TAInstruction) {
    this.instructions.push(instruction);
  }
  getInstructions() {
    return this.instructions;
  }
  toString() {
    const lines = [];
    for (let opcode of this.instructions) {
      lines.push(opcode.toString());
    }
    return lines.join("\n");
  }
  addLabel() {
    const label = "L" + this.labelCounter++;
    const taCode = new TAInstruction(TAInstructionType.LABEL);
    taCode.setArg1(label);
    this.instructions.push(taCode);
    return taCode;
  }

  setStaticSymbolTable(symbolTable: SymbolTable) {
    for (const symbol of symbolTable.getChildren()) {
      if (symbol.getType() == SymbolType.CALCULATE_SYMBOL) {
        this.staticSymbolTable.add(symbol as CalculateSymbol);
      }
    }

    for (const child of symbolTable.getLinks()) {
      this.setStaticSymbolTable(child);
    }
  }

  getStaticSymbolTable() {
    return this.staticSymbolTable;
  }
}
