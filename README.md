# boon-js

boon-js is a parser and evaluator for boon, The **bo**olean expressi**on** language. This package is built in typescript and has no dependencies

Boon is a format for defining boolean expressions as strings. It looks like this:

```boon
(isHungry OR isThirsty) AND NOT isFridgeFull
```

These expressions can be:

- stored in config such as JSON
- shared between processes
- written and read by non-technical team members or clients

## Installation

Add this package from npm using `npm install boon-js` or `yarn add boon-js`

## Usage

Use getEvaluator to return a function that evaluates the expression for any given input

```javascript
import { getEvaluator } from 'boon-js';

// You can save the function to a variable
const velociraptorTest = getEvaluator(
  '(canOpenDoors OR isCleverGirl) AND hasLotsOfTeeth',
);

const mysteryAnimal = {
  canOpenDoors: true,
  isCleverGirl: false,
  hasLotsOfTeeth: true,
};

velociraptorTest((mysteryAnimal); // Returns true

// or invoke it immediately
getEvaluator('unlocked AND open')({ unlocked: true}) // returns false
```

## API reference

### getEvaluator()

Returns a function that evaluates the expression for any given input. The returned function takes a map of strings to any type. The type is coerced into a boolean to get the value of the string.

Arguments

- expression: string

Returns

- function

  Arguments

  - booleanMap: Record<string, any>

  Returns

  - expressionResult: boolean

### parse()

Parses an expression into a series of tokens in [postfix notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation)

Arguments

- expression: string

Returns

- parsedExpression: PostfixExpression

### evaluate()

Evaluates a PostfixExpression output from `parse()`

Arguments

- expression: PostfixExpression
- booleanMap: Record<string, any>

Returns

- result: boolean

## About boon

Boon is a standard format for human-readable boolean expressions. Typically, boolean expressions are defined within the code that evaluates them. Boon allows engineers to pull in a boolean expression defined elsewhere. This may be another process or a user interface

Boon supports the following operators:

- NOT
- XOR
- AND
- OR

Operators are evaluated in that order and must be uppercase. Boon also supports the use of parentheses to override operator precedence

Full boon specification will be linked here

### Examples

```boon
tyrannosaurus-rex

NOT tyrannosaurus-rex

tyrannosaurus-rex AND NOT (Brachiosaurus OR gallimimus)

tyrannosaurus-rex AND (Brachiosaurus XOR (gallimimus OR T_PRORSUS))

tyrannosaurus-rex XOR (
  Brachiosaurus AND (
    gallimimus AND T_PRORSUS
  )
)
```

## Under the hood

boon-js uses a lexer to produce a token stream from an expression string. This token stream is then fed to a parser. This parser uses Djikstra's shunting yard algorithm to convert the token stream to an array of tokens arranged using postfix notation. Once the operands are resolvable the evaluate function uses the postfix expression to compute a result

## License

[MIT](https://https://github.com/jakec-github/boon-js/blob/master/LICENSE.md)
