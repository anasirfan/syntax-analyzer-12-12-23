class Keyword {
    constructor() {
        this.keywordMappings = {
            'break': 'BREAK',
            'continue': 'CONTINUE',
            'class': 'CLASS',
            'else': 'ELSE',
            'if': 'IF',
            'cycle': 'CYCLE',
            'using': 'USING',
            'void': 'VOID',
            'return': 'RETURN',
            'static': 'STATIC',
            'this': 'THIS',
            'super': 'SUPER',
            'public': 'AccessModifiers',
            'private': 'AccessModifiers',
            'interface': 'INTERFACE',
            'executes': 'EXECUTES',
            'inherits': 'INHERITS',
            'protected': 'AccessModifiers',
            'print':'PRINT',
            'end':'END',
            'create':'CREATE',
            'try':'TRY',
            'list':'LIST',
            'catch': "CATCH",
            'implements':'IMPLEMENTS',


            // 'true':'TRUE_FALSE',
            // 'false':'TRUE_FALSE',
            
            
        };
    }

    isKeyword(lexeme) {
        return lexeme in this.keywordMappings;
    }
    getClass(lexeme) {
        return this.keywordMappings[lexeme];
    }
}

export default Keyword;