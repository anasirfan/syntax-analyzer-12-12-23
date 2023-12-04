import { DefinitionTableEntry, MemberTableEntry, ScopeTableEntry, TypeInfo } from './semantic_analyzer';

class SymbolTableManager {
    constructor() {
        this.last_scope_num = 0;
        this.scope_stack = [];
        this.scope_table = [];
        this.definition_table = [];
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
      console.log(scopetable)
      // console.log(scopetable.name)
      const scopetableinstance = [];

        const scope = this.scope_stack[this.scope_stack.length - 1];

        for (const entry of this.scope_table) {
          console.log("name: "+entry[0] + " current name: " + scopetable.name);
          console.log("scope"+ entry[2] + " current scope: " + scopetable.scope )
            if (entry[0] === scopetable.name && entry[2] === scopetable.scope) {
              console.log("error")
                return false;
            }
        }
// console.log(scope)
        // scopetable.scope = scope;
        scopetableinstance.push(scopetable.name,scopetable.type,scopetable.scope);
        this.scope_table.push(scopetableinstance)
        return true;
    }

    insert_into_definition_table(defTableEntry) {
      const deftableinstance = [];
      console.log(defTableEntry)
        for (const entry of this.definition_table) {
            if (entry[0] === defTableEntry.name) {
                return false;
            }
        }

        deftableinstance.push(defTableEntry.name,defTableEntry.type,defTableEntry.access_modifier,defTableEntry.parent_class,defTableEntry.implements_list,defTableEntry.interface_list,defTableEntry.member_table);
        this.definition_table.push(deftableinstance)
        return true;
    }

//     insert_into_member_table(memberTableEntry) {
//         const memberTable = this.lookup_definition_table(this.current_def_name).member_table;

//         for (const entry of memberTable) {
//             if (entry.name === memberTableEntry.name) {
//                 if (!entry.type.is_function || !memberTableEntry.type.is_function) {
//                     return false;
//                 }

//                 if (entry.type.func_param_type_list.toString() === memberTableEntry.type.func_param_type_list.toString()) {
//                     return false;
//                 }
//             }
//         }

//         memberTable.push(memberTableEntry);
//         return true;
//     }

//     check_inside_loop() {
//         for (let i = this.scope_stack.length - 1; i >= 0; i--) {
//             const [, isLoop] = this.scope_stack[i];

//             if (isLoop) {
//                 return true;
//             }
//         }

//         return false;
//     }

    lookup_scope_table(name) {
      console.log(this.scope_stack)
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

//     lookup_definition_table(name) {
//         for (const entry of this.definition_table) {
//             if (entry.name === name) {
//                 return entry;
//             }
//         }
//     }

//     lookup_member_table(name, defRef) {
//         let defTable = this.lookup_definition_table(defRef);

//         for (const entry of defTable.member_table) {
//             if (entry.name === name) {
//                 if (!entry.type.is_function) {
//                     return entry;
//                 }
//             }
//         }

//         while (defTable.parent_class !== null) {
//             defTable = this.lookup_definition_table(defTable.parent_class);

//             for (const entry of defTable.member_table) {
//                 if (entry.name === name) {
//                     if (!entry.type.is_function) {
//                         return entry;
//                     }
//                 }
//             }
//         }
//     }
//     lookup_member_table_func(name, param_type_list, def_ref) {
//       let defTable = this.lookup_definition_table(def_ref);
  
//       for (const entry of defTable.member_table) {
//           if (entry.name === name && entry.type.is_function && entry.type.func_param_type_list.toString() === param_type_list.toString()) {
//               return entry;
//           }
//       }
  
//       while (defTable.parent_class !== null) {
//           defTable = this.lookup_definition_table(defTable.parent_class);
  
//           for (const entry of defTable.member_table) {
//               if (entry.name === name && entry.type.is_function && entry.type.func_param_type_list.toString() === param_type_list.toString()) {
//                   return entry;
//               }
//           }
//       }
//   }
  
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
//   check_compatibility_binary_op(left_operand_type, right_operand_type, operator) {
//     if (operator === "=") {
//         if (left_operand_type.equals(right_operand_type)) {
//             return left_operand_type;
//         } else if (
//             left_operand_type.data_type === "float" &&
//             right_operand_type.data_type === "int"
//         ) {
//             if (this.check_types_differ(left_operand_type, right_operand_type)) {
//                 return;
//             }
//             return left_operand_type;
//         } else if (
//             left_operand_type.is_user_defined_type &&
//             right_operand_type.is_user_defined_type
//         ) {
//             if (
//                 this.check_parent_class(
//                     left_operand_type.data_type,
//                     right_operand_type.data_type
//                 )
//             ) {
//                 if (this.check_types_differ(left_operand_type, right_operand_type)) {
//                     return;
//                 }
//                 return left_operand_type;
//             }
//         } else if (
//             left_operand_type.is_array &&
//             right_operand_type.is_array &&
//             right_operand_type.data_type === ""
//         ) {
//             return left_operand_type;
//         } else {
//             return;
//         }
//     } else if (["+=", "-=", "*=", "/=", "%="].includes(operator)) {
//         if (left_operand_type.data_type === right_operand_type.data_type) {
//             return left_operand_type;
//         } else if (
//             left_operand_type.data_type === "float" &&
//             right_operand_type.data_type === "int"
//         ) {
//             if (this.check_types_differ(left_operand_type, right_operand_type)) {
//                 return;
//             }
//             return left_operand_type;
//         } else if (
//             left_operand_type.is_array &&
//             right_operand_type.is_array &&
//             right_operand_type.data_type === ""
//         ) {
//             return left_operand_type;
//         } else {
//             return;
//         }
//     }

//     if (left_operand_type.is_array || right_operand_type.is_array) {
//         return;
//     }
//     if (left_operand_type.is_pointer || right_operand_type.is_pointer) {
//         return;
//     }

//     if (operator === "+") {
//         if (
//             left_operand_type.data_type === "char" &&
//             right_operand_type.data_type === "char"
//         ) {
//             return new TypeInfo("char");
//         }
//         if (
//             left_operand_type.data_type === "char" &&
//             right_operand_type.data_type === "string"
//         ) {
//             return new TypeInfo("string");
//         }
//         if (
//             left_operand_type.data_type === "string" &&
//             right_operand_type.data_type === "char"
//         ) {
//             return new TypeInfo("string");
//         }
//         if (
//             left_operand_type.data_type === "string" &&
//             right_operand_type.data_type === "string"
//         ) {
//             return new TypeInfo("string");
//         }
//         if (
//             left_operand_type.data_type === "int" &&
//             right_operand_type.data_type === "int"
//         ) {
//             return new TypeInfo("int");
//         }
//         if (
//             left_operand_type.data_type === "int" &&
//             right_operand_type.data_type === "float"
//         ) {
//             return new TypeInfo("float");
//         }
//         if (
//             left_operand_type.data_type === "float" &&
//             right_operand_type.data_type === "int"
//         ) {
//             return new TypeInfo("float");
//         }
//         if (
//             left_operand_type.data_type === "float" &&
//             right_operand_type.data_type === "float"
//         ) {
//             return new TypeInfo("float");
//         }
//     } else if (["-", "*", "/", "%"].includes(operator)) {
//         if (
//             left_operand_type.data_type === "int" &&
//             right_operand_type.data_type === "int"
//         ) {
//             return new TypeInfo("int");
//         }
//         if (
//             left_operand_type.data_type === "int" &&
//             right_operand_type.data_type === "float"
//         ) {
//             return new TypeInfo("float");
//         }
//         if (
//             left_operand_type.data_type === "float" &&
//             right_operand_type.data_type === "int"
//         ) {
//             return new TypeInfo("float");
//         }
//         if (
//             left_operand_type.data_type === "float" &&
//             right_operand_type.data_type === "float"
//         ) {
//             return new TypeInfo("float");
//         }
//     } else if (operator === "==") {
//         if (left_operand_type.data_type === right_operand_type.data_type) {
//             return new TypeInfo("bool");
//         }
//         if (
//             ["int", "float"].includes(left_operand_type.data_type) &&
//             ["int", "float"].includes(right_operand_type.data_type)
//         ) {
//             return new TypeInfo("bool");
//         }
//     } else if (["<", ">", "<=", ">="].includes(operator)) {
//         if (
//             ["int", "float"].includes(left_operand_type.data_type) &&
//             ["int", "float"].includes(right_operand_type.data_type)
//         ) {
//             return new TypeInfo("bool");
//         }
//     } else if (["&&", "||"].includes(operator)) {
//         if (
//             left_operand_type.data_type === "bool" &&
//             right_operand_type.data_type === "bool"
//         ) {
//             return new TypeInfo("bool");
//         }
//     }
// }

// check_compatibility_unary_op(operand_type, operator) {
//   if (operand_type.is_array) {
//     return null;
//   }
//   if (operator === '!' && operand_type.data_type === 'bool' && !operand_type.is_pointer) {
//     return new TypeInfo('bool');
//   }
//   if (operator === '*' && operand_type.is_pointer) {
//     return new TypeInfo(operand_type.data_type);
//   }
//   if (operator === '&' && !operand_type.is_pointer) {
//     const new_type = new TypeInfo(operand_type.data_type);
//     new_type.is_pointer = true;
//     return new_type;
//   }
// }

print_def_table() {
  console.log('Definition Table');
  console.log(this.definition_table)
  const entry_tuples = this.definition_table.map((entry) => ({
    Name: entry[0],
    'Access Modifier': entry[2],
    Type: entry[1],
    Parent: entry[3],
    Interface: entry[5].join(', '),
    Implements: entry[4].join(', ')
  }));

  console.log(
    this.printTable(
      entry_tuples,
      ['Name', 'Access Modifier', 'Type', 'Parent', 'Interface', "Implements"]
    
    )
  );
}

// print_all_member_tables() {
//   console.log('Member Tables: ');
//   this.definition_table.forEach((def_entry) => {
//     const entry_tuples = def_entry.member_table.map((entry) => ({
//       Name: entry.name,
//       'Access Modifier': entry.access_modifier,
//       Type: entry.type,
//       'Is Static': entry.is_static,
//     }));

//     console.log(
//       this.printTable(
//         entry_tuples,
//         ['Name', 'Access Modifier', 'Type', 'Is Static']
        
//       )
//     );
//   });
// }

print_scope_table() {
  console.log('Scope Table:');
  console.log(this.scope_table);
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
