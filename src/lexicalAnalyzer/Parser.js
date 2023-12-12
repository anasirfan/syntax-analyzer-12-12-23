// Assume Grammar is properly implemented and provides firstSets and followSets
import Grammar from "./Grammar";
import { TypesErrorTryExcept } from "./semantic_analyzer";
// import SemanticAnalyzer from "./semantic_analyzer";
import SymbolTable from "./symbol_table";
import DataType from "../lexemes/DataType";
import { MemberType, func_data_type_check } from "./semantic_analyzer";
import {
  DefinitionTableEntry,
  ScopeTableEntry,
  MemberTableEntry,
  TypeInfo,
  TypeCheckingInfo,
} from './semantic_analyzer';

class Parser {
  constructor(lexer) {
    console.log(lexer);
    this.lexer = lexer;
    this.trycatcherrors = new TypesErrorTryExcept();
    this.currentIndex = 0;
    this.currentToken = this.lexer[this.currentIndex];
    this.firstSets = new Grammar().firstSets;
    this.followSets = new Grammar().followSets;
    this.SymbolTable = new SymbolTable();
    this.ScopeTableEntry = new ScopeTableEntry();
    this.func_data_type = '';
    this.func_data_type_array = [];


    // this.MemberTableEntry = [new MemberTableEntry()];
    this.datatypecheck = new DataType();
    // this.SemanticAnalyzer = new SemanticAnalyzer();
  }

  displaySemanticError(msg, showLineNumber = true) {
    throw new SyntaxError(`Semantic error ${this.currentToken.lineNumber ? `at line# ${this.currentToken.lineNumber}` : ''} :\n  ${msg}`);
    // console.log('-'.repeat(70));
  }


  parseS() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseS()"
    );

    this.SymbolTable.scope_stack.push(0);
    if (this.currentToken && this.currentToken.class) {
      if (
        this.currentToken.lexeme !== "EOF" &&
        this.currentToken.lexeme !== "abstract" &&
        this.currentToken.lexeme !== "interface" &&
        this.currentToken.lexeme !== "class" &&
        this.parseSST()
      ) {
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "parse sst "
        );
        if (this.parseS()) {
          return true;
        }
      } else if (this.Access_modifier()) {
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "class found!"
        );
        if (this.Class()) {
          if (this.parseS()) {
            return true;
          }
        } else if (this.currentToken.lexeme === "abstract") {
          if (this.Abstract_class()) {
            if (this.parseS()) {
              return true;
            }
          }
        }
      } else if (this.currentToken.lexeme === "interface") {
        if (this.parseInterface()) {
          return true;
        }
      } else if (this.currentToken.type === "EOF") {
        return true;
      } else {
        return false;
      }
    }
  }

  // Parser   for SST
  parseSST() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseSST()"
    );
    this.TypeChecker = new TypeCheckingInfo();
    if (this.Expression()) {
      if (this.currentToken.lexeme === ";") {

        if (this.TypeChecker.left_operand_type !== "" && (this.TypeChecker.right_operand_type.data_type !== "") && this.operator !== "") {
          console.log("working")
          if (!this.SymbolTable.check_compatibility_binary_op(this.TypeChecker.left_operand_type, this.TypeChecker.right_operand_type, this.TypeChecker.operator)) {
            this.displaySemanticError("TYPE MISMATCH ERROR");
            this.SymbolTable.print_scope_table();
          }
        }
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        return true;
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.parseDeclaration()) {
      return true;
    } else if (this.parseTryExcept()) {
      return true;
    } else if (this.parseReturn()) {
      return true;
    } else if (this.func_dec()) {
      return true;
    } else if (this.parseIfElse()) {
      return true;
    } else if (this.Array_def()) {
      return true;
    } else if (this.parseBreak()) {
      return true;
    } else if (this.parseCycleLoop()) {
      return true;
    } else if (this.TS()) {
      if (this.Expression()) {
        if (this.currentToken.lexeme === ";") {
          if (this.TypeChecker.left_operand_type !== "" && (this.TypeChecker.right_operand_type.data_type !== "") && this.operator !== "") {
            console.log("working")
            if (!this.SymbolTable.check_compatibility_binary_op(this.TypeChecker.left_operand_type, this.TypeChecker.right_operand_type, this.TypeChecker.operator)) {
              this.displaySemanticError("TYPE MISMATCH ERROR");
              this.SymbolTable.print_scope_table();

            }
          }
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
        //  throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
      }
    } else if (this.Expression()) {
      return true;
    } else if (this.const()) {
      return true;
    } else if (this.parseContinue()) {
      return true;
    } else {
      return false;
    }
  }
  parseSST1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseSST1()"
    );

    if (this.Array_def()) {
      return true;
    }
    //  else if (this.parseObject()) {
    //   return true;
    // }
    else if (this.inc_dec()) {
      return true;
    } else if (this.Arr_func()) {
      return true;
    } else if (this.currentToken.type === "DATATYPE") {
      return true;
    } else if (this.currentToken.lexeme === "return") {
      return true;
    } else if (this.currentToken.lexeme === "if") {
      return true;
    } else if (this.currentToken.lexeme === "cycle") {
      return true;
    } else if (this.currentToken.lexeme === "break") {
      return true;
    } else if (this.currentToken.lexeme === "continue") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else if (this.currentToken.lexeme === "try") {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.currentToken.lexeme === "except") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  TS() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "TS()"
    );

    if (
      this.currentToken.lexeme === "this" ||
      this.currentToken.lexeme === "super"
    ) {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === ".") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        return true;
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (
      this.const() ||
      this.currentToken.lexeme === "(" ||
      this.currentToken.lexeme === "!" ||
      this.currentToken.class === "VARIABLE"
    ) {
      return true;
    } else {
      return false;
    }
  }

  parseInit() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseInit()"
    );

    if (this.currentToken.lexeme === "=") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "assignment operator found! "
      );
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      // if (this.TS()) {
      if (this.Expression()) {
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "Expression completed! "
        );
        return true;
      }
      // }
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else if (this.currentToken.lexeme === ",") {
      return true;
    } else {
      return false;
    }
  }
  parseInitList() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseInitList()"
    );

    if (this.currentToken.lexeme === ",") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];

      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.parseInit()) {
          console.log("parse init true");
          if (this.parseInitList()) {
            return true;
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else {
      return false;
    }
  }
  ClassparseInit() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseInit()"
    );

    if (this.currentToken.lexeme === "=") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "assignment operator found! "
      );
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.TS()) {
        if (this.Expression()) {
          console.log(
            this.currentToken.class +
            " " +
            this.currentToken.lexeme +
            " ON LINE - " +
            this.currentToken.lineNumber +
            " " +
            "Expression completed! "
          );
          return true;
        }
        throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
      }
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else if (this.currentToken.lexeme === ",") {
      return true;
    } else {
      return false;
    }
  }

  FollowSST() {
    if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else if (this.currentToken.lexeme === "break") {
      return true;
    } else if (this.currentToken.lexeme === "continue") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else if (this.currentToken.lexeme === "VARIABLE") {
      return true;
    } else if (this.currentToken.lexeme === "list") {
      return true;
    } else if (this.currentToken.lexeme === "return") {
      return true;
    } else if (this.currentToken.lexeme === "if") {
      return true;
    } else if (this.currentToken.lexeme === "cycle") {
      return true;
    } else if (this.currentToken.type === "DataType") {
      return true;
    } else if (this.currentToken.class === "AccessModifiers") {
      return true;
    } else if (this.currentToken.lexeme === "class") {
      return true;
    } else if (this.currentToken.lexeme === "interface") {
      return true;
    } else if (this.currentToken.lexeme === "abstract") {
      return true;
    } else if (this.currentToken.lexeme === "try") {
      return true;
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else if (this.currentToken.lexeme === "EOF") {
      return true;
    } else {
      return false;
    }
  }
  ClassparseInitList() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseInitList()"
    );

    if (this.currentToken.lexeme === ",") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];

      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.ClassparseInit()) {
          if (this.ClassparseInitList()) {
            return true;
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else {
      return false;
    }
  }

  // Parser   for Declaration
  parseDeclaration() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseDeclaration()"
    );
    if (this.currentToken.class === "CREATE") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "DataTypes") {
        this.ScopeTableEntry.type = this.currentToken.lexeme;
        this.TypeChecker.left_operand_type = this.currentToken.lexeme;
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "data type found!"
        );
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.class === "VARIABLE") {

          this.ScopeTableEntry.name = this.currentToken.lexeme;


          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          console.log(
            this.currentToken.class +
            " " +
            this.currentToken.lexeme +
            " ON LINE - " +
            this.currentToken.lineNumber +
            " " +
            "var found!"
          );

          if (this.parseInit()) {
            console.log(
              this.currentToken.class +
              " " +
              this.currentToken.lexeme +
              " ON LINE - " +
              this.currentToken.lineNumber +
              " " +
              "init parsing found!"
            );

            if (this.parseInitList()) {
              console.log(
                this.currentToken.class +
                " " +
                this.currentToken.lexeme +
                " ON LINE - " +
                this.currentToken.lineNumber +
                " " +
                "init parsing list  found!"
              );

              if (this.currentToken.lexeme === ";") {
                console.log(this.TypeChecker)
                
                if (!this.SymbolTable.insert_into_scope_table(this.ScopeTableEntry)) {
                  this.displaySemanticError("REDECLARATION ERROR");
                  this.SymbolTable.print_scope_table();

                }
                if (!this.SymbolTable.check_compatibility_binary_op(this.TypeChecker.left_operand_type, this.TypeChecker.right_operand_type, this.TypeChecker.operator)) {
                  this.displaySemanticError("TYPE MISMATCH ERROR");
                  this.SymbolTable.print_scope_table();

                }
                this.currentIndex += 1;
                this.currentToken = this.lexer[this.currentIndex];
                return true;
              }
            }
          }
        }
      }
      //  throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.lexeme === ")") {
      return true;
    } else {
      return false;
    }
  }

  parseReturn() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseReturn()"
    );

    if (this.currentToken.lexeme === "return") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "return success"
      );
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.cases()) {
        return true;
      }
    } else {
      return false;
    }
  }

  cases() {
    if (this.Expression()) {

      return true;
    } else if (this.currentToken.lexeme === "class") {
      return true;
    } else if (this.currentToken.lexeme === "abstract") {
      return true;
    } else if (this.currentToken.lexeme === "interface") {
      return true;
    } else {
      return false;
    }
  }

  parseReturn1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseReturn1()"
    );

    if (this.Expression()) {
      if (this.currentToken.lexeme === ";") {
        if (this.TypeChecker.left_operand_type !== "" && (this.TypeChecker.right_operand_type.data_type !== "") && this.operator !== "") {
          console.log("working")
          if (!this.SymbolTable.check_compatibility_binary_op(this.TypeChecker.left_operand_type, this.TypeChecker.right_operand_type, this.TypeChecker.operator)) {
            this.displaySemanticError("TYPE MISMATCH ERROR");
            this.SymbolTable.print_scope_table();

          }
        }
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        return true;
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.lexeme === ";") {
      console.log("semi colon found!");
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    }
  }

  parseBreak() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseBreak()"
    );

    if (this.currentToken.lexeme === "break") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else {
      return false;
    }
  }

  parseContinue() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseContinue()"
    );

    if (this.currentToken.lexeme === "continue") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else {
      return false;
    }
  }

  inc_dec() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "inc_dec()"
    );

    if (this.inc_dec_opt()) {
      return true;
    } else {
      return false;
    }
  }

  inc_dec_opt() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "inc_dec_opt()"
    );

    if (this.currentToken.lexeme === "++") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      console.log(this.TypeChecker)
      if (!this.SymbolTable.check_compatibility_unary_op(this.TypeChecker.left_operand_type, this.TypeChecker.operator)) {
        this.displaySemanticError("TYPE MISMATCH ERROR !");
      }
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else if (this.currentToken.lexeme === "--") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else {
      return false;
    }
  }

  // Parser   for IfElse
  parseIfElse() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseIfElse()"
    );

    if (this.currentToken.lexeme === "if") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "if found!"
      );
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === "(") {
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "starting braces found!"
        );
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.Expression()) {
          if (this.TypeChecker.left_operand_type !== "" && (this.TypeChecker.right_operand_type.data_type !== "") && this.operator !== "") {
            console.log("working")
            if (!this.SymbolTable.check_compatibility_binary_op(this.TypeChecker.left_operand_type, this.TypeChecker.right_operand_type, this.TypeChecker.operator)) {
              this.displaySemanticError("TYPE MISMATCH ERROR");
              this.SymbolTable.print_scope_table();

            }
          }
          if (this.currentToken.lexeme === ")") {
            console.log(
              this.currentToken.class +
              " " +
              this.currentToken.lexeme +
              " ON LINE - " +
              this.currentToken.lineNumber +
              " " +
              "ending braces found!"
            );
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.body()) {

              if (this.else()) {

                return true;
              }
            }
          }
        }
      }
      // throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "body()"
    );
    const current_scope = this.SymbolTable.create_scope();

    this.ScopeTableEntry.scope = current_scope;
    if (this.parseSST()) {
      return true;
    } else if (this.currentToken.lexeme === "{") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.parseMST()) {
        if (this.currentToken.lexeme === "}") {
          this.SymbolTable.destroy_scope();
          this.ScopeTableEntry.scope = 0;
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
      // throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  parseMST() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseMST()"
    );

    if (this.parseSST()) {
      if (this.parseMST()) {
        return true;
      } else if (this.currentToken.lexeme === "}") {
        return true;
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else {
      return false;
    }
  }

  else() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "else()"
    );

    if (this.currentToken.lexeme === "else") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.body()) {
        return true;
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.class === "DataTypes") {
      return true;
    } else if (this.currentToken.lexeme === "return") {
      return true;
    } else if (this.currentToken.lexeme === "list") {
      return true;
    } else if (this.currentToken.lexeme === "if") {
      return true;
    } else if (this.currentToken.lexeme === "cycle") {
      return true;
    } else if (this.currentToken.lexeme === "break") {
      return true;
    } else if (this.currentToken.lexeme === "continue") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.currentToken.lexeme === "except") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "try") {
      return true;
    } else if (this.currentToken.class === "AccessModifiers") {
      return true;
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else if (this.currentToken.lexeme === "class") {
      return true;
    } else if (this.currentToken.lexeme === "interface") {
      return true;
    } else if (this.currentToken.lexeme === "abstract") {
      return true;
    } else {
      return false;
    }
  }

  parseCycleLoop() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseCycleLoop()"
    );

    if (this.currentToken.lexeme === "cycle") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.loopCases()) {
        if (this.parseCycleLoopBody()) {
          return true;
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  loopCases() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "loopCases()"
    );
    if (this.currentToken.lexeme === "(") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.parseDeclaration()) {
        console.log("parse completed in cycle");
        if (this.Expression()) {
          console.log("Expression completed in cycle");

          if (this.currentToken.lexeme === ";") {
            console.log("semi col found in cycle");
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];

            if (this.currentToken.class === "VARIABLE") {
              console.log("VARIABLE  found in cycle");

              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              if (this.currentToken.lexeme === "++") {
                this.currentIndex += 1;
                this.currentToken = this.lexer[this.currentIndex];
                console.log("++  found in cycle");
                if (this.currentToken.lexeme === ")") {
                  this.currentIndex += 1;
                  this.currentToken = this.lexer[this.currentIndex];
                  return true;
                }
              }

            }
          }
        }
      } else if (this.currentToken.lexeme === "{") {
        return true;
      } else if (this.Expression()) {
        if (this.currentToken.lexeme === ")") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.type === "Datatype") {
      return true;
    } else if (this.currentToken.lexeme === "return") {
      return true;
    } else if (this.currentToken.lexeme === "list") {
      return true;
    } else if (this.currentToken.lexeme === "if") {
      return true;
    } else if (this.currentToken.lexeme === "cycle") {
      return true;
    } else if (this.currentToken.lexeme === "break") {
      return true;
    } else if (this.currentToken.lexeme === "continue") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.currentToken.lexeme === "except") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "try") {
      return true;
    } else if (this.currentToken.class === "AccessModifiers") {
      return true;
    } else if (this.currentToken.lexeme === "{") {
      return true;
    } else if (this.currentToken.lexeme === "class") {
      return true;
    } else if (this.currentToken.lexeme === "interface") {
      return true;
    } else if (this.currentToken.lexeme === "abstract") {
      return true;
    } else {
      return false;
    }
  }
  parseCycleLoopBody() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseCycleLoopBody()"
    );

    if (this.parseSST()) {
      return true;
    } else if (this.currentToken.lexeme === "{") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.parseMST()) {
        if (this.currentToken.lexeme === "}") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  parseTryExcept() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseTryExcept()"
    );

    if (this.currentToken.lexeme === "try") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === "{") {
        const create_scope = this.SymbolTable.create_scope();

        this.ScopeTableEntry.scope = create_scope;
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.parseMST()) {
          if (this.currentToken.lexeme === "}") {
            this.SymbolTable.destroy_scope();
            this.ScopeTableEntry.scope = 0;
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.tryRest()) {
              return true;
            }
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }
  tryRest() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "tryRest()"
    );
    if (this.currentToken.lexeme === "catch") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === "(") {
        const create_scope = this.SymbolTable.create_scope()
        this.ScopeTableEntry.scope = create_scope
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];

        if (this.currentToken.class === "VARIABLE") {

          this.ScopeTableEntry.type = this.currentToken.lexeme;

          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          this.trycatcherrors.isTypeExist = false;

          for (let i = 0; i < this.trycatcherrors.list.length; i++) {
            // console.log(this.trycatcherrors.list[i]);
            if (this.ScopeTableEntry.type === this.trycatcherrors.list[i]) {
              this.trycatcherrors.isTypeExist = true;
            }
          }

          if (this.trycatcherrors.isTypeExist === false) {

            this.displaySemanticError("ERROR DOESN'T EXIST");
          }
          if (this.currentToken.class === "VARIABLE") {
            this.ScopeTableEntry.name = this.currentToken.lexeme;
            this.SymbolTable.insert_into_scope_table(this.ScopeTableEntry)
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.currentToken.lexeme === ")") {
              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              if (this.currentToken.lexeme === "{") {
                this.currentIndex += 1;
                this.currentToken = this.lexer[this.currentIndex];
                if (this.parseMST()) {
                  if (this.currentToken.lexeme === "}") {
                    this.SymbolTable.destroy_scope();
                    this.ScopeTableEntry.scope = 0;
                    this.currentIndex += 1;
                    this.currentToken = this.lexer[this.currentIndex];
                    if (this.tryRest()) {
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.FollowSST()) {
      return true;
    } else {
      return false;
    }
  }

  try_body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "try_body()"
    );

    if (this.parseSST()) {
      return true;
    } else if (this.currentToken.lexeme === "{") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.parseMST()) {
        if (this.currentToken.lexeme === "}") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  except() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "except()"
    );

    if (this.currentToken.lexeme === "except") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];

      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.except_body()) {
          return true;
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    }
  }

  except_body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "except_body()"
    );

    if (this.parseSST()) {
      return true;
    } else if (this.currentToken.lexeme === "{") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.parseMST()) {
        if (this.currentToken.lexeme === "{") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  func_dec() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "func_dec()"
    );
    this.functionData = new MemberType();

    
    if (this.currentToken.type === "DataType") {
      this.functionData.is_function = true;
      this.functionData.func_return_type = this.currentToken.lexeme;
      this.ScopeTableEntry.type = this.currentToken.lexeme
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "VARIABLE") {

        this.functionData.func_name = this.currentToken.lexeme;

        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.lexeme === "(") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.PARAMLIST()) {
            console.log(
              this.currentToken.class +
              " " +
              this.currentToken.lexeme +
              " ON LINE - " +
              this.currentToken.lineNumber +
              " " +
              "expression comp"
            );
            if (this.currentToken.lexeme === ")") {
              // console.log(this.functionData)
              this.ScopeTableEntry.type = this.functionData.toString(this.functionData.is_function)
              this.ScopeTableEntry.name = this.functionData.func_name
              this.ScopeTableEntry.scope -= 1
              if (!this.SymbolTable.lookup_function(this.functionData.func_name, this.functionData.func_param_type_list.join(','))) {
                this.displaySemanticError("FUNCTION ALREADY DECLARED!")
              }
              this.SymbolTable.insert_into_scope_table(this.ScopeTableEntry)


              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              if (this.func_body()) {
                return true;
              }
            }
          } else if (this.currentToken.lexeme === "{") {
            console.log("starting brace");
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.func_body()) {
              return true;
            }
          } else if (this.currentToken.lexeme === ")") {
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.func_body()) {
              return true;
            }
          } else {
            console.log("cant find {");
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  PARAMLIST() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "PARAMLIST()"
    );
    const current_scope = this.SymbolTable.create_scope();

    this.ScopeTableEntry.scope = current_scope;

    if (this.type()) {
      if (this.currentToken.class === "VARIABLE") {

        this.ScopeTableEntry.name = this.currentToken.lexeme

        if (!this.SymbolTable.insert_into_scope_table(this.ScopeTableEntry)) {
          this.displaySemanticError("REDECLARATION ERROR");
          this.SymbolTable.print_scope_table();

        }
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.PL2()) {
          return true;
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken
      .lexeme === ")") {

      return true;
    } else {
      console.log("paramlist () false")

      return false;
    }
  }

  type() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "type()"
    );
    if (
      this.currentToken.class === "VARIABLE" ||
      this.currentToken.type === "DataType"
    ) {

      this.ScopeTableEntry.type = this.currentToken.lexeme
      
       if (this.functionData) {
        
        this.functionData.func_param_type_list.push(this.currentToken.lexeme)
      } if(this.MemberTableEntry) {
        

        this.MemberTableEntry.type.func_param_type_list.push(this.currentToken.lexeme)
      }
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    }
    else {
      console.log("type () false")
      return false;
    }
  }
  PL2() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "PL2()"
    );
    if (this.currentToken.lexeme === ",") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.type()) {
        if (this.currentToken.class === "VARIABLE") {
          this.ScopeTableEntry.name = this.currentToken.lexeme
          if (!this.SymbolTable.insert_into_scope_table(this.ScopeTableEntry)) {
            this.displaySemanticError("REDECLARATION ERROR");
            this.SymbolTable.print_scope_table();

          }
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.PL2()) {
            return true;
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.lexeme === ")") {
      console.log("PL2 ")
      return true;
    } else {
      console.log("PL2 () false")

      return false;
    }
  }

  func_body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "func_body()"
    );
    this.ScopeTableEntry.scope += 1
    if (this.currentToken.lexeme === "{") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.parseMST()) {
        if (this.currentToken.lexeme === "}") {
          this.SymbolTable.destroy_scope();
          this.ScopeTableEntry.scope = 0;

          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.type === "Datatype") {
      return true;
    } else if (this.currentToken.lexeme === "return") {
      return true;
    } else if (this.currentToken.lexeme === "list") {
      return true;
    } else if (this.currentToken.lexeme === "if") {
      return true;
    } else if (this.currentToken.lexeme === "cycle") {
      return true;
    } else if (this.currentToken.lexeme === "break") {
      return true;
    } else if (this.currentToken.lexeme === "continue") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.currentToken.lexeme === "except") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "try") {
      return true;
    } else if (this.currentToken.class === "AccessModifiers") {
      return true;
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else if (this.currentToken.lexeme === "class") {
      return true;
    } else if (this.currentToken.lexeme === "interface") {
      return true;
    } else if (this.currentToken.lexeme === "abstract") {
      return true;
    } else {
      return false;
    }
  }
  Array_def() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Array_def()"
    );

    if (this.currentToken.lexeme === "list") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.Arr_type()) {
        if (this.currentToken.class === "VARIABLE") {

          if (this.MemberTableEntry) {
            this.MemberTableEntry.name = this.currentToken.lexeme;
          } else {
            this.ScopeTableEntry.name = this.currentToken.lexeme;
          }
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.currentToken.lexeme === "=") {

            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.body_Arr()) {
              return true;
            }
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else {
      return false;
    }
  }

  Arr_type() {
    if (this.currentToken.type === "DataType") {
      if (this.MemberTableEntry) {
        this.MemberTableEntry.var_type = this.currentToken.lexeme;
      } else {
        this.ScopeTableEntry.type = this.currentToken.lexeme;

      }
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else if (this.currentToken.lexeme === "list") {

      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.type === "DataType") {
        this.ScopeTableEntry.type = this.currentToken.lexeme;

        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        return true;
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  body_Arr() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "body_Arr()"
    );

    if (this.currentToken.lexeme === "[") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.inside_Arr_body()) {
        if (this.currentToken.lexeme === "]") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.currentToken.lexeme === ";") {


            if (this.MemberTableEntry) {
              if (!this.SymbolTable.insert_into_member_table(this.MemberTableEntry)) {
                this.displaySemanticError("REDECLARATION ERROR!")
              }
            } else {
              if (!this.SymbolTable.insert_into_scope_table(this.ScopeTableEntry)) {
                this.displaySemanticError("REDECLARATION ERROR");
                this.SymbolTable.print_scope_table();

              }
            }
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            return true;
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  inside_Arr_body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "inside_Arr_body()"
    );
    if (this.body_Arr()) {
      if (this.a()) {
        return true;
      }
    } else if (this.Expression()) {
      if (this.a()) {
        return true;
      }
    } else if (this.currentToken.lexeme === "]") {
      return true;
    } else {
      return false;
    }
  }
  a() {
    if (this.currentToken.lexeme === ",") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.inside_Arr_body()) {
        return true;
      }
    } else if (this.currentToken.lexeme === "]") {
      return true;
    } else {
      return false;
    }
  }

  rpt2() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "rpt2()"
    );

    if (this.currentToken.lexeme === ",") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.inside_Arr_body()) {
        return true;
      }
    } else if (this.currentToken.lexeme === "]") {
      return true;
    } else {
      return false;
    }
  }

  Arr_func() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Arr_func()"
    );

    if (this.currentToken.lexeme === ".") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.Array_call_func()) {
        return true;
      }
    } else {
      return false;
    }
  }

  Array_call_func() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Array_call_func()"
    );

    if (this.currentToken.lexeme === "append") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === "(") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.append_value()) {
          if (this.currentToken.lexeme === ")") {
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            return true;
          }
        }
      }
    } else if (this.currentToken.lexeme === "pop") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === "(") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.lexeme === ")") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
    } else {
      return false;
    }
  }

  append_value() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "append_value()"
    );

    if (this.currentToken.class === "VARIABLE") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else if (this.const()) {
      return true;
    } else if (this.body_Arr()) {
      return true;
    } else {
      return false;
    }
  }

  Array_call() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Array_call()"
    );

    if (this.currentToken.lexeme === "[") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.Expression()) {
        if (this.currentToken.lexeme === "]") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.arrayRemaining()) {
            return true;
          }
        }
      }
    } else {
      return false;
    }
  }

  arrayRemaining() {
    if (this.Array_call()) {
      return true;
    } else if (this.F2()) {
      return true;
    } else if (this.currentToken.class === "INCREMENT_DECREMENT") {
      return true;
    } else if (this.currentToken.class === "MULTIPLY_DIVIDE_MODULUS") {
      return true;
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (
      this.currentToken.class === "COMPOUND_EQUAL_PLUS" ||
      this.currentToken.class === "COMPOUND_EQUAL_MINUS" ||
      this.currentToken.class === "COMPOUND_EQUAL_DIVIDE" ||
      this.currentToken.class === "COMPOUND_EQUAL_MULTIPLY"
    ) {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.currentToken.lexeme === "(") {
      return true;
    } else if (this.currentToken.lexeme === "!") {
      return true;
    } else if (this.constfollow()) {
      return true;
    } else {
      return false;
    }
  }
  func_split(paramlist){
    return this.split_arr = paramlist.split('->')
  }
  func_type_check(param1,param2){
  
    if(param1 === param2){
      console.log("matched")
      return true;
    }else{
      console.log("not matched")

      return false;
    }
  }

  func_call() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "func_call()"
    );
    console.log("at func call :")
    console.log(this.func_data_type)

    this.result = this.func_split(this.func_data_type)
    console.log("result :")
    console.log(this.result)
    if (this.currentToken.lexeme === "(") {
       this.func_check = new func_data_type_check();
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.func_call_list()) {
        if(!this.func_type_check(this.func_check.paramlist.join(','),this.result[0])){
          this.displaySemanticError("FUNCTION TYPE MISMATCH ERROR")
        }
        
        if (this.currentToken.lexeme === ")") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.L()) {
            return true;
          }

        }
      }
    } else {
      return false;
    }
  }

  func_call_list() {
    if (this.Expression()) {
      if (this.func_call_a()) {
        return true;
      }

    }
    else {
      return false
    }
  }

  func_call_a() {
    if (this.currentToken.lexeme === ',') {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.func_call_list()) {
        return true;
      }
    } else if(this.currentToken.lexeme === ")"){
      return true;
    }
    else {
      return false;

    }
  }
  L() {
    // if (this.currentToken.lexeme === "[") {
    //   this.currentIndex += 1;
    //   this.currentToken = this.lexer[this.currentIndex];
    //   if (this.Expression()) {
    //     if (this.currentToken.lexeme === "]") {
    //       this.currentIndex += 1;
    //       this.currentToken = this.lexer[this.currentIndex];
    //       if(this.L()){
    //         return true;
    //       }
    //     }
    //   }
    // }
    if (this.currentToken.lexeme === ";") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    }
    else if (this.F2()) {
      if (this.L()) {
        return true;
      }
    } else if (this.currentToken.class === "INCREMENT_DECREMENT") {
      return true;
    } else if (this.currentToken.class === "MULTIPLY_DIVIDE_MODULUS") {
      return true;
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (
      this.currentToken.class === "COMPOUND_EQUAL_PLUS" ||
      this.currentToken.class === "COMPOUND_EQUAL_MINUS" ||
      this.currentToken.class === "COMPOUND_EQUAL_DIVIDE" ||
      this.currentToken.class === "COMPOUND_EQUAL_MULTIPLY"
    ) {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.currentToken.lexeme === "(") {
      return true;
    } else if (this.currentToken.lexeme === "!") {
      return true;
    } else if (this.constfollow()) {
      return true;
    } else {
      return false;
    }
  }

  func_call_value() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "func_call_value()"
    );

    if (this.Expression()) {
      if (this.rpt3()) {
        return true;
      }
    } else {
      return false;
    }
  }

  rpt3() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "rpt3()"
    );

    if (this.currentToken.lexeme === ",") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.func_call_value()) {
        return true;
      }
    } else if (this.currentToken.lexeme === ")") {
      return true;
    } else {
      return false;
    }
  }

  object_dec() {
    console.log("comes at obj dec at " + this.currentToken.lexeme);
    if (this.currentToken.class === "VARIABLE") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.lexeme === "=") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.currentToken.class === "VARIABLE") {
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.currentToken.lexeme === "(") {
              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];

              if (this.currentToken.lexeme === ")") {
                this.currentIndex += 1;
                this.currentToken = this.lexer[this.currentIndex];
                return true;
              }
            }
          }
        }
      }
    } else {
      return false;
    }
  }

  object_call() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "object_call()"
    );

    if (this.call()) {
      return true;
    } else {
      return false;
    }
  }

  call() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "call()"
    );

    if (this.currentToken.lexeme === ".") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.recall()) {
          return true;
        } else if (this.currentToken.lexeme === ";") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
    } else {
      return false;
    }
  }

  recall() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "recall()"
    );

    if (this.call()) {
      return true;
    } else if (this.func_call()) {
      if (this.call()) {
        return true;
      }
    } else if (this.Array_call()) {
      if (this.call()) {
        return true;
      }
    } else if (this.currentToken.lexeme === "return") {
      return true;
    } else if (this.currentToken.lexeme === "continue") {
      return true;
    } else if (this.currentToken.lexeme === "cycle") {
      return true;
    } else if (this.currentToken.lexeme === "try") {
      return true;
    } else if (this.currentToken.lexeme === "if") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else if (this.currentToken.lexeme === "this") {
      return true;
    } else if (this.currentToken.lexeme === "super") {
      return true;
    } else if (this.currentToken.lexeme === "=") {
      return true;
    } else if (this.currentToken.type === "DataType") {
      return true;
    } else if (this.currentToken.lexeme === "list") {
      return true;
    } else if (this.currentToken.lexeme === "break") {
      return true;
    } else if (this.currentToken.lexeme === "]") {
      return true;
    } else if (this.currentToken.lexeme === ")") {
      return true;
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else if (this.currentToken.lexeme === ",") {
      return true;
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.constfollow()) {
      return true;
    } else if (this.currentToken.lexeme === "!") {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else {
      return false;
    }
  }
  classElse() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "else()"
    );

    if (this.currentToken.lexeme === "else") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.body()) {
        return true;
      }
    } else if (this.currentToken.lexeme === "return") {
      return true;
    } else if (this.currentToken.lexeme === "if") {
      return true;
    } else if (this.currentToken.lexeme === "cycle") {
      return true;
    } else if (this.currentToken.lexeme === "break") {
      return true;
    } else if (this.currentToken.lexeme === "continue") {
      return true;
    } else if (this.currentToken.lexeme === "else") {
      return true;
    } else if (this.currentToken.lexeme === "except") {
      return true;
    } else if (this.currentToken.lexeme === "try") {
      return true;
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else {
      return false;
    }
  }

  parseClassIfElse() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parseIfElse()"
    );

    if (this.currentToken.lexeme === "if") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "if found!"
      );
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === "(") {
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "starting braces found!"
        );
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.Expression()) {
          if (this.currentToken.lexeme === ")") {
            console.log(
              this.currentToken.class +
              " " +
              this.currentToken.lexeme +
              " ON LINE - " +
              this.currentToken.lineNumber +
              " " +
              "ending braces found!"
            );
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.classifelsebody()) {
              if (this.else()) {
                return true;
              }
            }
          }
        }
      }
    }
  }

  rest() {
    if (this.CMST()) {
      if (this.rest()) {
        return true;
      }
    } else if (this.currentToken.lexeme === "}") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else {
      return false;
    }
  }

  classifelsebody() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "body()"
    );

    if (this.parseCMST()) {
      return true;
    } else if (this.currentToken.lexeme === "{") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.rest()) {
        if (this.currentToken.lexeme === "}") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
    } else {
      return false;
    }
  }

  Class() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Class()"
    );
    this.DefinitionTableEntry = new DefinitionTableEntry();

    if (this.currentToken.lexeme === "class") {
      this.DefinitionTableEntry.type = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];

      if (this.currentToken.class === "VARIABLE") {
        this.SymbolTable.current_def_name = this.currentToken.lexeme;
        this.DefinitionTableEntry.name = this.currentToken.lexeme;
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "var found!"
        );
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];

        if (this.Inheritance()) {
          console.log(
            this.currentToken.class +
            " " +
            this.currentToken.lexeme +
            " ON LINE - " +
            this.currentToken.lineNumber +
            " " +
            "inh true"
          );
          if (this.opt_imp()) {
            if (this.class_body()) {
              return true;
            }
          }
        }
      }
      throw new SyntaxError("INVALID SYNTAX: " + this.currentToken.lexeme);
    } else {
      return false;
    }
  }

  Access_modifier() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Access_modifier()"
    );
    this.MemberTableEntry = new MemberTableEntry();

    if (this.currentToken.class === "AccessModifiers") {

      this.DefinitionTableEntry.access_modifier = this.currentToken.lexeme;


      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else if (this.currentToken.lexeme === "class") {
      return true;
    } else if (this.currentToken.type === "DataType") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else if (this.currentToken.lexeme === "abstract") {
      return true;
    } else if (this.currentToken.lexeme === "static") {
      return true;
    } else {
      return false;
    }
  }

  Inheritance() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Inheritance()"
    );

    if (this.currentToken.lexeme === "extends") {

      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "extends found"
      );
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "VARIABLE") {

        if (!this.SymbolTable.lookup_definition_table(this.currentToken.lexeme)) {
          this.displaySemanticError("UNDEFINED PARENT CLASS")
        }
        this.DefinitionTableEntry.parent_class = this.currentToken.lexeme;


        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "extends var found"
        );
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.opt_imp()) {
          return true;
        } else if (this.currentToken.lexeme === "{") {
          return true;
        }
      }
    } else if (this.currentToken.lexeme === "implements") {
      return true;
    } else if (this.currentToken.lexeme === "{") {
      return true;
    } else {
      return false;
    }
  }

  opt_imp() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "opt_imp()"
    );

    if (this.currentToken.lexeme === "implements") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "implement found"
      );
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];

      if (this.currentToken.class === "VARIABLE") {
        if (!this.SymbolTable.lookup_definition_table(this.currentToken.lexeme)) {
          this.displaySemanticError("UNDEFINED INTERFACE!")
        }


        this.DefinitionTableEntry.implements_list.push(this.currentToken.lexeme)
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "extends var found"
        );
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.opt_imp()) {
          return true;
        }
      }
      throw new SyntaxError(
        "INVALID SYNTAX: " +
        this.currentToken.lexeme +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber
      );
    } else if (this.currentToken.lexeme === "{") {
      return true;
    } else {
      return false;
    }
  }

  class_body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "class_body()"
    );

    const bool = this.SymbolTable.insert_into_definition_table(this.DefinitionTableEntry)
    if (bool === false) {
      this.displaySemanticError("Class Already Defined!")
    }

    if (this.currentToken.lexeme === "{") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "class csst in c body"
      );
      if (this.CSST()) {
        console.log("came out of csst" + this.currentToken.lexeme);

        if (this.currentToken.lexeme === "}") {
          console.log("end braces");
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
    }
    console.log(" executing the false");
    // else {
    return false;
    // }
  }

  CMST() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "CMST()"
    );

    if (this.parseReturn()) {
      return true;
    } else if (this.parseContinue()) {
      return true;
    } else if (this.parseBreak()) {
      return true;
    } else if (this.parseCycleLoop()) {
      return true;
    } else if (this.parseIfElse()) {
      return true;
    } else if (this.TS()) {
      if (this.Expression()) {
        if (this.currentToken.lexeme === ";") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];

          return true;
        }
      }
    } else if (this.currentToken.lexeme === "create") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.Access_modifier()) {




        if (this.classVarDeclaration()) {
          return true;
        }
      }
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else {
      return false;
    }
  }

  class_Dec() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "class_Dec()"
    );

    if (this.Access_modifier()) {
      this.currentIndex -= 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "AccessModifiers") {

        this.MemberTableEntry.access_modifier = this.currentToken.lexeme;
      }
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.classVarDeclaration()) {
        return true;
      }
    } else {
      return false;
    }
  }
  classVarDeclaration() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "classVarDeclaration()"
    );

    if (this.IFStatic()) {
      if (this.currentToken.type === "DataType") {
        

        this.MemberTableEntry.var_type = this.currentToken.lexeme
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.class === "VARIABLE") {
          this.MemberTableEntry.name = this.currentToken.lexeme
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];

          if (this.ClassparseInit()) {
            console.log(
              this.currentToken.class +
              " " +
              this.currentToken.lexeme +
              " ON LINE - " +
              this.currentToken.lineNumber +
              " " +
              "init parsing found!"
            );
            if (this.ClassparseInitList()) {
              console.log(
                this.currentToken.class +
                " " +
                this.currentToken.lexeme +
                " ON LINE - " +
                this.currentToken.lineNumber +
                " " +
                "init parsing list found!"
              );
              if (this.currentToken.lexeme === ";") {

                if (!this.SymbolTable.insert_into_member_table(this.MemberTableEntry)) {
                  this.displaySemanticError("REDECLARATION ERROR!")
                }

                this.currentIndex += 1;
                this.currentToken = this.lexer[this.currentIndex];
                return true;
              }
            }

          }
        }
      }
    } else if (this.currentToken.lexeme === ")") {
      return true;
    } else if (this.currentToken.lexeme === "}") {
      return true;

    }
    else {
      return false;
    }
  }

  IFStatic() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "IFStatic()"
    );

    if (this.currentToken.lexeme === "static") {
      this.MemberTableEntry.is_static = true;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else if (this.currentToken.type === "DataType") {
      return true;
    } else {
      return false;
    }
  }

  class_method() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "class_method()"
    );




    if (this.Access_modifier()) {
      this.currentIndex -= 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "AccessModifiers") {

        this.MemberTableEntry.access_modifier = this.currentToken.lexeme;
      }
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];

      if (this.IFStatic()) {
        // console.log("static checked")

        if (this.currentToken.class === "DataTypes") {

          this.MemberTableEntry.type.is_function = true;
          this.MemberTableEntry.type.func_return_type = this.currentToken.lexeme
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.currentToken.class === "VARIABLE") {
            this.MemberTableEntry.name = this.currentToken.lexeme

            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.currentToken.lexeme === "(") {
              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              if (this.PARAMLIST()) {
                if (this.currentToken.lexeme === ")") {
                  console.log(this.MemberTableEntry.type)
                  this.MemberTableEntry.var_type = this.MemberTableEntry.type.toString(this.MemberTableEntry.type.is_function)
                  console.log("params ends : ")
                  console.log(this.MemberTableEntry)
                  this.ScopeTableEntry.scope -= 1
                  console.log("classs name current : ")
                  console.log(this.DefinitionTableEntry.name)
                  console.log("func name : ")
                  console.log(this.MemberTableEntry.name)
                  console.log("param list : ")
                  console.log(this.MemberTableEntry.type)
                  if (!this.SymbolTable.lookup_member_table_func(this.MemberTableEntry.name, this.MemberTableEntry.type.func_param_type_list, this.DefinitionTableEntry.name)) {
                    this.displaySemanticError("FUNCTION ALREADY DECLARED")
                  }


                  this.SymbolTable.insert_into_member_table(this.MemberTableEntry)
                  this.currentIndex += 1;
                  this.currentToken = this.lexer[this.currentIndex];
                  if (this.c_method_body()) {
                    return true;
                  } else if (this.currentToken.lexeme === ";") {
                    this.currentIndex += 1;
                    this.currentToken = this.lexer[this.currentIndex];
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      return false;
    }
  }

  c_method_body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "c_method_body()"
    );

    if (this.currentToken.lexeme === "{") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.parseMST()) {
        if (this.currentToken.lexeme === "}") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
    } else {
      return false;
    }
  }

  CSST() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "CSST()"
    );

    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "CSST found"
    );
    if (this.currentToken.class === "CREATE") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.ParseDec()) {
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "PARSE DEC C OMPLETE"
        );
        if (this.CSST()) {
          return true;
        }

      }
    } else if (this.Constructor()) {
      if (this.CSST()) {
        return true;
      }
    } else if (this.class_method()) {
      if (this.CSST()) {
        return true;
      }
    } else if (this.Array_def()) {
      if (this.CSST()) {
        return true;
      }

    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else {
      return false;
    }
  }

  ParseDec() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "ParseDec()"
    );

    if (this.class_Dec()) {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "class dec complete"
      );
      return true;
    } else if (this.object_dec()) {
      return true;
    } else {
      return false;
    }
  }

  Constructor() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Constructor()"
    );

    if (this.Access_modifier()) {
      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.lexeme === "(") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.PARAMLIST()) {
            if (this.currentToken.lexeme === ")") {
              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              if (this.currentToken.lexeme === "{") {
                this.currentIndex += 1;
                this.currentToken = this.lexer[this.currentIndex];
                if (this.constructor_body()) {
                  if (this.currentToken.lexeme === "}") {
                    this.currentIndex += 1;
                    this.currentToken = this.lexer[this.currentIndex];
                    return true;
                  }
                }
              }
            }
          } else if (this.currentToken.lexeme === ")") {
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.currentToken.lexeme === "{") {
              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              if (this.constructor_body()) {
                if (this.currentToken.lexeme === "}") {
                  this.currentIndex += 1;
                  this.currentToken = this.lexer[this.currentIndex];
                  return true;
                }
              }
            }
          }
        }
      }
    } else {
      return false;
    }
  }

  constructor_body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "constructor_body()"
    );

    if (this.classVarDeclaration()) {
      if (this.constructor_body()) {
        return true;
      }
    } else if (this.Expression()) {
      if (this.constructor_body()) {
        return true;
      }
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else {
      return false;
    }
  }
  constructor_MST() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "constructor_MST()"
    );

    if (this.currentToken.class === "this") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === ".") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.Dec()) {
          if (this.constructor_MST()) {
            return true;
          }
        }
      } else if (this.CSST()) {
        if (this.constructor_MST()) {
          return true;
        }
      } else if (this.currentToken.lexeme === "}") {
        return true;
      }
    } else {
      return false;
    }
  }

  Abstract_class() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Abstract_class()"
    );

    if (this.currentToken.lexeme === "abstract") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.lexeme === "class") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.class === "VARIABLE") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.currentToken.lexeme === "{") {
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.Abstract_body()) {
              return true;
            }
          }
        }
      }
    } else {
      return false;
    }
  }

  Abstract_body() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Abstract_body()"
    );

    if (this.Abstract_inside()) {
      if (this.currentToken.lexeme === "}") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        return true;
      }
    }
    if (this.currentToken.lexeme === "}") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      return true;
    } else {
      return false;
    }
  }

  Abstract_inside() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Abstract_inside()"
    );
    if (this.Abstract_func_types()) {
      if (this.Abstract_inside()) {
        return true;
      }
    } else if (this.parseDeclaration()) {
      console.log("parse dec true");
      if (this.Abstract_inside()) {
        return true;
      }
    } else if (this.object_dec()) {
      if (this.Abstract_inside()) {
        return true;
      }
    } else if (this.class_Dec()) {
      if (this.Abstract_inside()) {
        return true;
      }
    } else {
      return false;
    }
  }

  Abstract_func_types() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Abstract_func_types()"
    );

    if (this.Abstract_method()) {
      return true;
    } else if (this.class_method()) {
      return true;
    } else {
      return false;
    }
  }

  Abstract_method() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Abstract_method()"
    );

    if (this.currentToken.type === "DataType") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.lexeme === "(") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.PARAMLIST()) {
            if (this.currentToken.lexeme === ")") {
              console.log("found ending ")
              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              if (this.currentToken.lexeme === ";") {
                this.currentIndex += 1;
                this.currentToken = this.lexer[this.currentIndex];
                return true;
              } else if (this.currentToken.lexeme === "{") {
                this.currentIndex += 1;
                this.currentToken = this.lexer[this.currentIndex];
                if (this.parseMST()) {
                  if (this.currentToken.lexeme === "}") {
                    this.currentIndex += 1;
                    this.currentToken = this.lexer[this.currentIndex];
                    return true;
                  }
                }
              }
            }
          }

        }
      }
    } else {
      return false;
    }
  }

  object_class() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "object_class()"
    );

    if (this.currentToken.class === "VARIABLE") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.lexeme === "=") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.currentToken.class === "VARIABLE") {
            this.currentIndex += 1;
            this.currentToken = this.lexer[this.currentIndex];
            if (this.currentToken.lexeme === "(") {
              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              if (this.Expression()) {
                if (this.currentToken.lexeme === ")") {
                  this.currentIndex += 1;
                  this.currentToken = this.lexer[this.currentIndex];
                  if (this.currentToken.lexeme === ";") {
                    this.currentIndex += 1;
                    this.currentToken = this.lexer[this.currentIndex];
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      return false;
    }
  }
  Expression() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Expression()"
    );

    if (this.compound_Ass()) {
      if (this.Expression1()) {
        return true;
      }
    } else if (this.currentToken.lexeme === ")") {
      return true;
    } else {
      return false;
    }
  }

  Expression1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Expression1()"
    );


    if (
      this.currentToken.class === "COMPOUND_EQUAL_PLUS" ||
      this.currentToken.class === "COMPOUND_EQUAL_MINUS" ||
      this.currentToken.class === "COMPOUND_EQUAL_DIVIDE" ||
      this.currentToken.class === "COMPOUND_EQUAL_MULTIPLY"
    ) {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.compound_Ass()) {
        if (this.Expression1()) {
          return true;
        }
      }
    } else if (this.currentToken.type === "Operator") {
      return true;
    }
    // else if (this.currentToken.type === "Keyword") {
    //   return true;
    // }
    else if (this.currentToken.lexeme === "!") {
      return true;
    } else if (this.currentToken.lexeme === "]") {
      return true;
    } else if (this.currentToken.lexeme === ",") {
      return true;
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else if (this.currentToken.lexeme === ")") {
      return true;
    } else if (this.currentToken.lexeme === "(") {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.const()) {
      return true;
    } else if (this.currentToken.lexeme === ".") {
      return true;
    } else if (this.currentToken.lexeme === ",") {
      return true;
    } else {
      return false;
    }
  }

  compound_Ass() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "compound_Ass()"
    );

    if (this.Assignment_opt()) {
      if (this.compound_Ass1()) {
        return true;
      }
    } else {
      return false;
    }
  }
  followOE() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "followOE()"
    );

    if (this.currentToken.type === "Operator") {
      return true;
    } else if (this.currentToken.type === "Keyword") {
      return true;
    } else if (this.currentToken.lexeme === "!") {
      return true;
    } else if (this.currentToken.lexeme === "create") {
      return true;
    } else if (this.currentToken.lexeme === "]") {
      return true;
    } else if (this.currentToken.lexeme === ",") {
      return true;
    } else if (this.currentToken.lexeme === ";") {
      return true;
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else if (this.currentToken.lexeme === ")") {
      // this.currentIndex += 1;
      // this.currentToken = this.lexer[this.currentIndex];

      return true;
    } else if (this.currentToken.lexeme === "(") {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.constfollow()) {
      return true;
    } else if (this.currentToken.lexeme === ".") {
      return true;
    }
  }
  compound_Ass1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "compound_Ass1()"
    );

    if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      this.TypeChecker.operator = this.currentToken.lexeme;

      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.Assignment_opt()) {
        if (this.compound_Ass1()) {
          return true;
        }
      }
    } else if (this.currentToken.type === "Operator") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  Assignment_opt() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Assignment_opt()"
    );

    if (this.NOT()) {
      if (this.Assignment_opt1()) {
        return true;
      }
    } else {
      return false;
    }
  }

  Assignment_opt1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Assignment_opt1()"
    );

    if (this.currentToken.class === "NOT") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.NOT()) {
        if (this.Assignment_opt1()) {
          return true;
        }
      }
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  NOT() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "NOT()"
    );

    if (this.OR()) {
      if (this.NOT1()) {
        return true;
      }
    } else {
      return false;
    }
  }

  NOT1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "NOT1()"
    );

    if (this.currentToken.class === "OR") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.OR()) {
        if (this.NOT1()) {
          return true;
        }
      }
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  OR() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "OR()"
    );

    if (this.AND()) {
      if (this.OR1()) {
        return true;
      }
    } else {
      return false;
    }
  }

  OR1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "OR1()"
    );

    if (this.currentToken.class === "AND") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.AND()) {
        if (this.OR1()) {
          return true;
        }
      }
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  AND() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "AND()"
    );

    if (this.ROP()) {
      if (this.AND1()) {
        return true;
      }
    } else {
      return false;
    }
  }

  AND1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "AND1()"
    );

    if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.ROP()) {
        if (this.AND1()) {
          return true;
        }
      }
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  ROP() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "ROP()"
    );

    if (this.PM()) {
      if (this.ROP1()) {
        return true;
      }
    } else {
      return false;
    }
  }

  ROP1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "ROP1()"
    );

    if (this.currentToken.class === "PLUS_MINUS") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.PM()) {
        if (this.ROP1()) {
          return true;
        }
      }
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.currentToken.class === "PLUS_MINUS") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  PM() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "PM()"
    );

    if (this.MDM()) {
      if (this.PM1()) {
        return true;
      }
    } else {
      return false;
    }
  }

  PM1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "PM1()"
    );

    if (this.currentToken.class === "MULTIPLY_DIVIDE_MODULUS") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.MDM()) {
        if (this.PM1()) {
          return true;
        }
      }
    } else if (this.currentToken.class === "PLUS_MINUS") {
      return true;
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  MDM() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "MDM()"
    );

    if (this.P()) {
      if (this.MDM1()) {
        return true;
      }
    } else if (this.currentToken.class === "MULTIPLY_DIVIDE_MODULUS") {
      return true;
    } else if (this.currentToken.class === "PLUS_MINUS") {
      return true;
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  MDM1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "MDM1()"
    );

    if (this.currentToken.lexeme === "+") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.P()) {
        if (this.MDM1()) {
          return true;
        }
      }
    } else if (this.currentToken.class === "MULTIPLY_DIVIDE_MODULUS") {
      return true;
    } else if (this.currentToken.class === "PLUS_MINUS") {
      return true;
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  P() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "P()"
    );

    if (this.Dec()) {
      if (this.P1()) {
        return true;
      }
    } else {
      return false;
    }
  }

  P1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "P1()"
    );

    if (this.currentToken.lexeme === "^") {
      this.TypeChecker.operator = this.currentToken.lexeme;
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.Dec()) {
        if (this.P1()) {
          return true;
        }
      }
    } else if (this.currentToken.lexeme === "+") {
      return true;
    } else if (this.currentToken.class === "MULTIPLY_DIVIDE_MODULUS") {
      return true;
    } else if (this.currentToken.class === "PLUS_MINUS") {
      return true;
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }

  Dec() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Dec()"
    );

    if (this.F()) {
      if (this.Dec1()) {
        return true;
      }
    } else {
      return false;
    }
  }

  Dec1() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "Dec1()"
    );

    if (this.currentToken.lexeme === "++") {
      console.log("at ++ ")

      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];

      if (this.F()) {
        if (this.Dec1()) {
          return true;
        }
      }
    } else if (this.currentToken.lexeme === "--") {
      return true;
    } else if (this.currentToken.lexeme === "+") {
      return true;
    } else if (this.currentToken.class === "MULTIPLY_DIVIDE_MODULUS") {
      return true;
    } else if (this.currentToken.class === "PLUS_MINUS") {
      return true;
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (this.followOE()) {
      return true;
    } else {
      return false;
    }
  }
  constfollow() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "constfollow()"
    );

    if (this.currentToken.class === "INTEGER") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "integer found !"
      );
      return true;
    } else if (this.currentToken.class === "BOOLEAN") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "BOOLEAN found !"
      );

      return true;
    } else if (this.currentToken.class === "STRING") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "STRING found !"
      );

      return true;
    } else if (this.currentToken.class === "FLOATING_POINT") {
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "FLOATING_NUMBER found !"
      );

      return true;
    } else {
      return false;
    }
  }
  const() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "const()"
    );

    if (this.currentToken.class === "INTEGER") {
      if(this.func_check){
        this.func_check.paramlist.push('num')
      }
      if(this.TypeChecker){
      if (this.TypeChecker.left_operand_type === '') {
        this.TypeChecker.left_operand_type = 'num'
      } else {
        this.TypeChecker.right_operand_type = 'num'

      }
    }
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "integer found !"
      );
      return true;
    } else if (this.currentToken.class === "BOOLEAN") {
      if(this.func_check){
        this.func_check.paramlist.push('bool')
      }
      if(this.TypeChecker){
        if (this.TypeChecker.left_operand_type === '') {
          this.TypeChecker.left_operand_type = 'bool'
        } else {
          this.TypeChecker.right_operand_type = 'bool'
  
        }
      }
     
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "BOOLEAN found !"
      );

      return true;
    } else if (this.currentToken.class === "STRING") {
      if(this.func_check){
        this.func_check.paramlist.push('string')
      }
      if(this.TypeChecker){
        if (this.TypeChecker.left_operand_type === '') {
          this.TypeChecker.left_operand_type = 'string'
        } else {
          this.TypeChecker.right_operand_type = 'string'
  
        }
      }
      
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "STRING found !"
      );

      return true;
    } else if (this.currentToken.class === "FLOATING_POINT") {
      if(this.func_check){
        this.func_check.paramlist.push('dec')
      }
      if(this.TypeChecker){
        if (this.TypeChecker.left_operand_type === '') {
          this.TypeChecker.left_operand_type = 'dec'
        } else {
          this.TypeChecker.right_operand_type = 'dec'
  
        }
      }
     
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      console.log(
        this.currentToken.class +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber +
        " " +
        "FLOATING_NUMBER found !"
      );

      return true;
    } else {
      return false;
    }
  }

  F() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "F()"
    );

    if (this.const()) {
      return true;
    } else if (this.currentToken.lexeme === "(") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.Expression()) {
        if (this.currentToken.lexeme === ")") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          return true;
        }
      }
    } else if (this.currentToken.lexeme === "!") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.F()) {
        return true;
      }
    } else if (this.currentToken.class === "VARIABLE") {

      const datatype = this.SymbolTable.lookup_scope_table(this.currentToken.lexeme);

      //   this.TypeChecker.left_operand_type = 'dec'
      this.func_data_type = datatype
      if(this.func_check){
        this.func_check.paramlist.push(datatype)
      }
      if(!this.MemberTableEntry){
      if (!datatype) {
        this.displaySemanticError("VARIABLE NOT DECLARED!")

      }
    } else {
      const membertablevardatatype = this.SymbolTable.lookup_member_table(this.currentToken.lexeme,this.DefinitionTableEntry.name)
      if(!membertablevardatatype){
        this.displaySemanticError("VARIABLE NOT DECLARED!")
      }
      this.func_data_type = membertablevardatatype.var_type
      
    }
    
      if (this.TypeChecker.left_operand_type === "" || this.TypeChecker.left_operand_type.data_type === '') {
        this.TypeChecker.left_operand_type = this.func_data_type;

      } else {

        this.TypeChecker.right_operand_type = this.func_data_type;
      }
      // if( datatype !== this.datatypecheck.isDataType(datatype)){
      //   this.displaySemanticError("Type MisMatched")
      // }
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.F2()) {
        console.log(
          this.currentToken.class +
          " " +
          this.currentToken.lexeme +
          " ON LINE - " +
          this.currentToken.lineNumber +
          " " +
          "F2 REACHED!!!"
        );
        return true;
      }
    } else {
      return false;
    }
  }

  F2() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "F2()"
    );

    if (this.object_call()) {
      return true;
    } else if (this.inc_dec()) {
      return true;
    } else if (this.func_call()) {
      return true;
    }
    // else if (this.Arr_func()) {
    //   return true;
    // }
    else if (this.Array_call()) {
      return true;
    } else if (this.currentToken.class === "INCREMENT_DECREMENT") {
      return true;
    } else if (this.currentToken.class === "MULTIPLY_DIVIDE_MODULUS") {
      return true;
    } else if (this.currentToken.class === "RELATIONAL_OPERATOR") {
      return true;
    } else if (this.currentToken.class === "AND") {
      return true;
    } else if (this.currentToken.class === "OR") {
      return true;
    } else if (this.currentToken.class === "NOT") {
      return true;
    } else if (this.currentToken.class === "ASSIGNMENT_EQUAL") {
      return true;
    } else if (
      this.currentToken.class === "COMPOUND_EQUAL_PLUS" ||
      this.currentToken.class === "COMPOUND_EQUAL_MINUS" ||
      this.currentToken.class === "COMPOUND_EQUAL_DIVIDE" ||
      this.currentToken.class === "COMPOUND_EQUAL_MULTIPLY"
    ) {
      return true;
    } else if (this.currentToken.class === "VARIABLE") {
      return true;
    } else if (this.currentToken.lexeme === "(") {
      return true;
    } else if (this.currentToken.lexeme === "!") {
      return true;
    } else if (this.constfollow()) {
      return true;
    } else {
      return false;
    }
  }

  parseInterface() {
    if (this.currentToken.lexeme === "interface") {
      this.currentIndex += 1;
      this.currentToken = this.lexer[this.currentIndex];
      if (this.currentToken.class === "VARIABLE") {
        this.currentIndex += 1;
        this.currentToken = this.lexer[this.currentIndex];
        if (this.currentToken.lexeme === "{") {
          this.currentIndex += 1;
          this.currentToken = this.lexer[this.currentIndex];
          if (this.interfacebody()) {
            if (this.currentToken.lexeme === "}") {
              this.currentIndex += 1;
              this.currentToken = this.lexer[this.currentIndex];
              return true;
            }
          }
        }
      }
    } else {
      return false;
    }
  }

  interfacebody() {
    if (this.Abstract_method()) {
      if (this.interfacebody()) {

        return true;
      }
    } else if (this.parseDeclaration()) {
      if (this.interfacebody()) {

        return true;
      }
    } else if (this.currentToken.lexeme === "}") {
      return true;
    } else {
      return false;
    }
  }

  // Entry point for parsing
  parse() {
    console.log(
      this.currentToken.class +
      " " +
      this.currentToken.lexeme +
      " ON LINE - " +
      this.currentToken.lineNumber +
      " " +
      "parse()"
    );
    this.SymbolTable.scope_stack.push(0)
    // Initialize the current token
    this.currentToken = this.lexer[this.currentIndex];
    if (this.parseS()) {
      console.log("success");
      console.log("NO SYNTAX ERROR!!");
      console.log("HAPPY CODING :) !!");
      this.SymbolTable.print_scope_table();
      this.SymbolTable.print_def_table();
      this.SymbolTable.print_all_member_tables();



    } else if (this.currentToken.type === "EOF") {
      console.log("NO SYNTAX ERROR!!");
      console.log("HAPPY CODING :) !!");
      this.SymbolTable.print_scope_table();
      this.SymbolTable.print_def_table();
      this.SymbolTable.print_all_member_tables();



    } else {
      this.SymbolTable.print_def_table();
      // this.SymbolTable.print_all_member_tables();
      // this.SymbolTable.print_scope_table();
      throw new SyntaxError(
        "INVALID SYNTAX: " +
        this.currentToken.lexeme +
        " " +
        this.currentToken.lexeme +
        " ON LINE - " +
        this.currentToken.lineNumber
      );


    }
  }

  // addVariableToSymbolTable(varName, varType) {
  //   if (this.symbolTable.inCurrentScope(varName)) {
  //     // Variable with the same name already declared in the current scope, raise an error
  //     console.error(`Error: Variable '${varName}' already declared in the current scope.`);
  //     // Handle the error, possibly halt further analysis
  //   } else {
  //     // Add the variable to the symbol table
  //     this.symbolTable.addVariable(varName, varType);
  //   }
  // }

  // typeCheck(expression, expectedType) {
  //   const actualType = getTypeOfExpression(expression); // Implement a function to get the type of an expression
  //   if (actualType !== expectedType) {
  //     // Type mismatch error
  //     console.error(`Error: Type mismatch. Expected ${expectedType}, but got ${actualType}.`);
  //     // Handle the error, possibly halt further analysis
  //   }
  // }
}

export default Parser;
