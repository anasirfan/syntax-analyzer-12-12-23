import { DefinitionTableEntry, MemberTableEntry, ScopeTableEntry, TypeInfo } from './semantic_analyzer';

class SymbolTableManager {
  constructor() {
    this.last_scope_num = 0;
    this.scope_stack = [];
    this.scope_table = [];
    this.definition_table = [new DefinitionTableEntry()];
    this.current_def_name = null;
    this.is_curr_def_class = false;
    this.is_main_found = false;
    this.curr_func_return_type = new TypeInfo();
  }

  generate_scope_number() {
    this.last_scope_num += 1;
    return this.last_scope_num;
  }

  create_scope(is_loop = false) {
    const rand_no = this.generate_scope_number()
    this.scope_stack.push(rand_no);
    return rand_no

  }

  destroy_scope() {
    this.scope_stack.pop();
  }

  //     check_constructor_exist() {
  //         const def_table = this.lookup_definition_table(this.current_def_name);

  //         for (const entry of def_table.member_table) {
  //             if (entry.name === 'constructor' && entry.type.is_function) {
  //                 return true;
  //             }
  //         }

  //         let parentClass = def_table.parent_class;

  //         while (parentClass !== null) {
  //             const parentDefTable = this.lookup_definition_table(parentClass);

  //             for (const entry of parentDefTable.member_table) {
  //                 if (entry.name === 'constructor' && entry.type.is_function) {
  //                     return true;
  //                 }
  //             }

  //             parentClass = parentDefTable.parent_class;
  //         }

  //         return false;
  //     }

  //     check_implements_interface() {
  //         const def_table = this.lookup_definition_table(this.current_def_name);

  //         for (const interfaceName of def_table.interface_list) {
  //             let currentInterfaceName = interfaceName;

  //             while (true) {
  //                 const interfaceTableEntry = this.lookup_definition_table(currentInterfaceName);

  //                 for (const interfaceMember of interfaceTableEntry.member_table) {
  //                     if (this.lookup_member_table_func(
  //                         interfaceMember.name,
  //                         interfaceMember.type.func_param_type_list,
  //                         this.current_def_name,
  //                     ) === null) {
  //                         return [false, interfaceName];
  //                     }
  //                 }

  //                 currentInterfaceName = interfaceTableEntry.parent_class;

  //                 if (currentInterfaceName === null) {
  //                     break;
  //                 }
  //             }
  //         }

  //         return [true, null];
  //     }

  insert_into_scope_table(scopetable) {

    // console.log(scopetable.name)
    const scopetableinstance = [];

    const scope = this.scope_stack[this.scope_stack.length - 1];

    for (const entry of this.scope_table) {

      if (entry[0] === scopetable.name && entry[2] === scopetable.scope) {

        return false;
      }
    }
    // console.log(scope)
    // scopetable.scope = scope;
    scopetableinstance.push(scopetable.name, scopetable.type, scopetable.scope);
    this.scope_table.push(scopetableinstance)
    return true;
  }

  insert_into_definition_table(defTableEntry) {


    for (const entry of this.definition_table) {
      if (entry.name === defTableEntry.name) {
        return false;
      }
    }


    this.definition_table.push(defTableEntry)

    return true;
  }

  insert_into_member_table(memberTableEntry) {
    console.log(memberTableEntry)
    const memberTable = this.lookup_definition_table(this.current_def_name).member_table;
    for (const entry of memberTable) {
      if (entry.name === memberTableEntry.name) {

        if (!entry.type.is_function || !memberTableEntry.type.is_function) {
          return false;
        }

        if (entry.type.func_param_type_list.toString() === memberTableEntry.type.func_param_type_list.toString()) {
          return false;
        }
      }
    }

    memberTable.push(memberTableEntry);

    console.log(this.definition_table);
    return true;
  }

  check_inside_loop() {
    for (let i = this.scope_stack.length - 1; i >= 0; i--) {
      const [, isLoop] = this.scope_stack[i];

      if (isLoop) {
        return true;
      }
    }

    return false;
  }

  lookup_scope_table(name) {
    console.log("scope table :")
    // console.log(this.scope_stack)
    for (let i = this.scope_stack.length - 1; i >= 0; i--) {
      console.log("first val")

      const scope = this.scope_stack[i];

      for (const entry of this.scope_table) {


        if (entry[0] === name && entry[2] === scope) {
          return entry[1];
        }
      }
    }
    return false;
  }

  lookup_definition_table(name) {

    for (const entry of this.definition_table) {
      if (entry.name === name) {

        return entry;
      }
    }
  }

  lookup_member_table(name, defRef) {
      let defTable = this.lookup_definition_table(defRef);

      for (const entry of defTable.member_table) {
          if (entry.name === name) {
              if (!entry.type.is_function) {
                  return entry;
              }
          }
      }

      // while (defTable.parent_class !== "") {
      //     defTable = this.lookup_definition_table(defTable.parent_class);
      //     for (const entry of defTable.member_table) {
      //         if (entry.name === name) {
      //             if (!entry.type.is_function) {
      //                 return entry;
      //             }
      //         }
      //     }
      // }
  }


  lookup_function(name, param_type_list) {

    for (const entry of this.scope_table) {
      if (entry[1].includes("->")) {
        const split = entry[1].split('->')[0];
        console.log("split " + split)
        if (split === param_type_list && entry[0] === name) {
          return false;
        }
      }

    }
    return true;

  }
  lookup_member_table_func(name, param_type_list, def_ref) {
    console.log("func name : ")
    console.log(name)
    console.log("param list : ")
    console.log(param_type_list)
    console.log("class ref : ")
    console.log(def_ref)
    let defTable = this.lookup_definition_table(def_ref);
    console.log("def tab ")
    console.log(defTable)
    for (const entry of defTable.member_table) {

      if (entry.name === name && entry.type.is_function && entry.type.func_param_type_list.toString() === param_type_list.toString()) {
        return false;
      }
    }

    // while (defTable.parent_class !== null) {
    //     defTable = this.lookup_definition_table(defTable.parent_class);

    //     for (const entry of defTable.member_table) {
    //         if (entry.name === name && entry.type.is_function && entry.type.func_param_type_list.toString() === param_type_list.toString()) {
    //             return entry;
    //         }
    //     }
    // }
    return true;
  }

  //   check_parent_class(parent_class_name, child_class_name) {
  //       const defTable = this.lookup_definition_table(child_class_name);

  //       if (parent_class_name === defTable.parent_class || defTable.interface_list.includes(parent_class_name)) {
  //           return true;
  //       }

  //       return false;
  //   }

  //   check_types_differ(left_operand_type, right_operand_type) {
  //       return (
  //           (left_operand_type.is_pointer && !right_operand_type.is_pointer) ||
  //           (!left_operand_type.is_pointer && right_operand_type.is_pointer) ||
  //           (left_operand_type.is_array && !right_operand_type.is_array) ||
  //           (!left_operand_type.is_array && right_operand_type.is_array)
  //       );
  //   }
  check_compatibility_binary_op(left_operand_type, right_operand_type, operator) {

    if (operator === "=") {
      if (left_operand_type === right_operand_type) {
        return left_operand_type;
      } else if (
        left_operand_type === "dec" &&
        right_operand_type === "num"
      ) {
        
        return left_operand_type;
      } 
    }
    // else if (
    //     left_operand_type.is_user_defined_type &&
    //     right_operand_type.is_user_defined_type
    //   ) {
    //     if (
    //       this.check_parent_class(
    //         left_operand_type.data_type,
    //         right_operand_type.data_type
    //       )
    //     ) {
    //       if (this.check_types_differ(left_operand_type, right_operand_type)) {
    //         return;
    //       }
    //       return left_operand_type;
    //     }
    //   } else if (
    //     left_operand_type.is_array &&
    //     right_operand_type.is_array &&
    //     right_operand_type.data_type === ""
    //   ) {
    //     return left_operand_type;
    //   } else {
    //     return;
    //   }
    // } 
    else if (["+=", "-=", "*=", "/=", "%="].includes(operator)) {
       if (
        left_operand_type === "dec" &&
        right_operand_type === "num"
      ) {
        
        return left_operand_type;
      } else if(left_operand_type === right_operand_type){
        return left_operand_type;

      }
    }

    // if (left_operand_type.is_array || right_operand_type.is_array) {
    //   return;
    // }
    // if (left_operand_type.is_pointer || right_operand_type.is_pointer) {
    //   return;
    // }

    if (operator === "+") {
      
      if (
        left_operand_type === "string" &&
        right_operand_type === "string"
      ) {
        return left_operand_type;
      }
      else if (
        left_operand_type === "num" &&
        right_operand_type === "num"
      ) {
        return left_operand_type;
      }
      else if (
        left_operand_type === "num" &&
        right_operand_type === "dec"
      ) {
        return right_operand_type;
      }
      else if (
        left_operand_type === "dec" &&
        right_operand_type === "num"
      ) {
        return left_operand_type;

      }
      else if (
        left_operand_type === "dec" &&
        right_operand_type === "dec"
      ) {
        return left_operand_type;

      }
    } 
    else if (["-", "*", "/", "%"].includes(operator)) {
      if (
        left_operand_type === "num" &&
        right_operand_type === "num"
      ) {
        return left_operand_type;

      }
      if (
        left_operand_type === "num" &&
        right_operand_type === "dec"
      ) {
        return right_operand_type;

      }
      if (
        left_operand_type === "dec" &&
        right_operand_type === "num"
      ) {
        return left_operand_type;
      }
      if (
        left_operand_type === "dec" &&
        right_operand_type === "dec"
      ) {
        return left_operand_type;
      }
    } 
    else if (operator === "==") {
      if (left_operand_type === right_operand_type) {
        return new TypeInfo("bool");
      }
      if (
        ["num", "dec"].includes(left_operand_type) &&
        ["num", "dec"].includes(right_operand_type)
      ) {
        return new TypeInfo("bool");
      }
    } else if (["<", ">", "<=", ">="].includes(operator)) {
      if (
        ["num", "dec"].includes(left_operand_type) &&
        ["num", "dec"].includes(right_operand_type)
      ) {
        return new TypeInfo("bool");
      }
    } else if (["&&", "||"].includes(operator)) {
      if (
        left_operand_type === "bool" &&
        right_operand_type === "bool"
      ) {
        return new TypeInfo("bool");
      }
    }
     else{
      return false;
    }
  }

  check_compatibility_unary_op(operand_type, operator) {
 
    if((operand_type === "num" || operand_type === "dec") && (operator === '++' || operator === '--')){
      return true;
    } else{
      return false;
    }

  }

  print_def_table() {
    console.log('Definition Table');

    const entry_tuples = this.definition_table.slice(1).map((entry) => ({
      Name: entry.name,
      'Access Modifier': entry.access_modifier,
      Type: entry.type,
      Parent: entry.parent_class,
      Interface: entry.interface_list.join(', '),
      Implements: entry.implements_list.join(', ')
    }));

    console.log(
      this.printTable(
        entry_tuples,
        ['Name', 'Access Modifier', 'Type', 'Parent', 'Interface', "Implements"]

      )
    );
  }

  print_all_member_tables() {
    console.log('Member Tables: ');
    this.definition_table.forEach((def_entry) => {
      const entry_tuples = def_entry.member_table.slice(1).map((entry) => ({
        Name: entry.name,
        'Access Modifier': entry.access_modifier,
        Type: entry.var_type,
        'Is Static': entry.is_static,
      }));

      console.log(
        this.printTable(
          entry_tuples,
          ['Name', 'Access Modifier', 'Type', 'Is Static']

        )
      );
    });
  }

  print_scope_table() {
    console.log('Scope Table:');

    const entry_tuples = this.scope_table.map((entry) => ({
      Name: entry[0],
      Type: entry[1],
      Scope: entry[2],
    }));

    console.log(
      this.printTable(entry_tuples, ['Name', 'Type', 'Scope'])
    );
  }
  printTable(data, headers) {
    // Find the maximum length of each column
    const columnLengths = headers.map(header => Math.max(...data.map(row => String(row[header]).length)));

    // Create the header
    let table = '';
    headers.forEach((header, index) => {
      table += header.padEnd(columnLengths[index] + 2) + ' | ';
    });
    table += '\n' + '-'.repeat(table.length - 1) + '\n';

    // Create rows
    data.forEach(row => {
      headers.forEach((header, index) => {
        table += String(row[header]).padEnd(columnLengths[index] + 2) + ' | ';
      });
      table += '\n';
    });

    console.log(table);
  }


  //     // Add any additional methods here as needed
}

export default SymbolTableManager;
