# Lexer test plan

## Basic tests

- lex one token and return remaining string
- lex an entire expression
- lex each operator
- lex an unquoted identifier
- lex a quoted identifier
- lex both structural characters
- lex a comment
- return an EOF token when no token is found

## Specific syntax

- return identifier token for lowercase operator
- lex an unquoted identifier containing a # character
- handle structural character in quoted identifier
- handle any whitespace character in quoted identifier
- handle # character in quoted identifier
- handle structural characters that are not separated from identifiers by whitespace
- handle all whitespace characters as separators
- handle comments containing special characters
- handle comments that terminate using carraige return then line feed

## Unhappy path

- lex an invalid seqeunce of tokens without error
- throw if it encounters an unterminated quoted identifier
