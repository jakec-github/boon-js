# Test plan

## getEvaluator (e2e tests)

### Valid

- true AND false
- true OR false
- NOT true XOR true
- true AND (false OR false)
- false AND true XOR true OR NOT true
- NOT (true AND true AND NOT true) XOR (NOT false XOR false)

## evaluate

### Basic

- evaluate true
- evaluate false
- evaluate NOT true
- evaluate NOT false

### Binary operators

- evalute XOR (all combinations)
- evalute AND (all combinations)
- evaluate OR (all combinations)

### Complex

- multiple operators
- three consecutive operators

### Unhappy

- throw if expression isn't an array
- throw if expression is empty
- throw if a token has an invalid shape
- throw if expression has too may identifiers
- throw if expression has too many operators
