class SymbolTable {
    constructor() {
      this.scopes = [];
      this.currentScope = null;
    }
  
    enterScope() {
      const newScope = {};
      this.scopes.push(newScope);
      this.currentScope = newScope;
    }
  
    exitScope() {
      this.scopes.pop();
      this.currentScope = this.scopes[this.scopes.length - 1];
    }
  
    declareVariable(name, type) {
      if (this.currentScope) {
        this.currentScope[name] = type;
      }
    }
  
    lookupVariable(name) {
      for (let i = this.scopes.length - 1; i >= 0; i--) {
        if (name in this.scopes[i]) {
          return this.scopes[i][name];
        }
      }
      return null; // Variable not found
    }
  }

  
  export default SymbolTable;