class Operator {
    constructor() {
        this.operatorMappings = {
            "+=": "COMPOUND_EQUAL_PLUS",
            "-=": "COMPOUND_EQUAL_MINUS",
            "/=": "COMPOUND_EQUAL_DIVIDE",
            "*=": "COMPOUND_EQUAL_MULTIPLY",
            "++": "INCREMENT_DECREMENT",
            "--": "INCREMENT_DECREMENT",
            "+": "PLUS_MINUS",
            "-": "PLUS_MINUS",
            "*": "MULTIPLY_DIVIDE_MODULUS",
            "/": "MULTIPLY_DIVIDE_MODULUS",
            "%": "MULTIPLY_DIVIDE_MODULUS",
            "&&": "AND",
            "||": "OR",
            "<=": "RELATIONAL_OPERATOR",
            ">=": "RELATIONAL_OPERATOR",
            "!=": "RELATIONAL_OPERATOR",
            "==": "RELATIONAL_OPERATOR",
            "!": "NOT",
            ">": "RELATIONAL_OPERATOR",
            "<": "RELATIONAL_OPERATOR",
            "=": "ASSIGNMENT_EQUAL",
            "^": "POWER",
        };
    }

    isOperator(lexeme) {
        return lexeme in this.operatorMappings;
    }
    getClass(lexeme) {
        return this.operatorMappings[lexeme];
    }
}

export default Operator;
