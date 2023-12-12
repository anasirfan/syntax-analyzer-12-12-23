export class TypeInfo {
  constructor(data_type = "") {

      this.data_type = data_type;
      this.dimensions = 0;
      this.is_pointer = false;
  }

  get is_user_defined_type() {
      return !["num", "dec", "string", "bool"].includes(this.data_type);
  }

  get is_array() {
      return this.dimensions > 0;
  }

  equals(other) {
      if (other instanceof TypeInfo) {
          return (
              this.data_type === other.data_type &&
              this.dimensions === other.dimensions &&
              this.is_pointer === other.is_pointer
          );
      }
      return false;
  }

  toString() {
      if (this.is_pointer) {
          return this.data_type + "*";
      }

      return this.data_type + "[]".repeat(this.dimensions);
  }
}



export class MemberType {
  constructor() {
      this.is_function = false;
      this.func_param_type_list = [];
      this.func_return_type = null;
      this.func_name = "";
      this.var_type =  new TypeInfo();
   
  }

  toString() {
      if (this.is_function) {
          const str_param_list = this.func_param_type_list.length > 0
              ? this.func_param_type_list.map(i => i.toString()).join(",")
              : "null";

          return str_param_list + "->" + this.func_return_type.toString();
      }
      return "Var: " + this.var_type.toString();
  }
}

export class ScopeTableEntry {
  constructor() {
      this.name = "";
      this.type = new TypeInfo();
      this.scope = 0;
  }
}

export class MemberTableEntry {
  constructor() {
      this.name = "";
      this.type = new MemberType();
      
      this.access_modifier = "private";
      this.is_static = false;
  }
}

export class TypesErrorTryExcept {
    constructor() {
       this.list = ["SyntaxError","TypeError", "NameError", "ValueError", "FileNotFoundError", "ZeroDivisionError" ]
       this.isTypeExist = false;

    }
  }
  

export class DefinitionTableEntry {
  constructor() {
      this.name = "";
      this.type = "";
      this.access_modifier = "public";
      this.parent_class = "";
      this.implements_list =[];
      this.interface_list = [];
      this.member_table =  [new MemberTableEntry()];
  }
}

export class TypeCheckingInfo {
  constructor() {
      this.left_operand_type = new TypeInfo();
      this.right_operand_type = new TypeInfo();
      this.operator = "";
      this.resultant_type = new TypeInfo();
  }
}


export class func_data_type_check {
    constructor() {
        this.paramlist = [];
        
    }

}
// Import SymbolTable from "./symbol_table";
// (Assuming you have SymbolTable class implemented in the symbol_table module)



