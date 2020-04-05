import { Operators } from '../types';

import { parse } from './parse';

describe('parse', () => {
  test('should parse a single value', () => {
    const result = parse('first');

    expect(result).toEqual({
      value: 'first',
      inverted: false,
    });
  });

  test('should parse a simple expression', () => {
    const result = parse('first AND second');

    expect(result).toEqual({
      value: {
        left: {
          value: 'first',
          inverted: false,
        },
        right: {
          value: 'second',
          inverted: false,
        },
        operator: Operators.AND,
      },
      inverted: false,
    });
  });

  test('should throw if terms are out of order', () => {
    expect(() => {
      parse('AND first second');
    }).toThrow('Invalid token');
  });

  test('should throw if the second term is missing', () => {
    expect(() => {
      parse('first AND');
    }).toThrow('Unexpected end of expression');
  });

  test('should throw if the operator is repeated', () => {
    expect(() => {
      parse('first AND AND second');
    }).toThrow('Invalid token');
  });

  test('should throw from an expression with an OR then a hanging AND operator', () => {
    expect(() => {
      parse('first OR second AND ');
    }).toThrow('Unexpected end of expression');
  });

  test('should parse an expression with an AND then an OR operator', () => {
    const result = parse('first AND second OR third');

    expect(result).toEqual({
      value: {
        left: {
          value: {
            left: {
              value: 'first',
              inverted: false,
            },
            right: {
              value: 'second',
              inverted: false,
            },
            operator: Operators.AND,
          },
          inverted: false,
        },
        right: {
          value: 'third',
          inverted: false,
        },
        operator: Operators.OR,
      },
      inverted: false,
    });
  });

  test('should parse an expression with an AND then an AND operator', () => {
    const result = parse('first AND second AND third');

    expect(result).toEqual({
      value: {
        left: {
          value: {
            left: {
              value: 'first',
              inverted: false,
            },
            right: {
              value: 'second',
              inverted: false,
            },
            operator: Operators.AND,
          },
          inverted: false,
        },
        right: {
          value: 'third',
          inverted: false,
        },
        operator: Operators.AND,
      },
      inverted: false,
    });
  });

  test('should parse an expression with an XOR, AND then an OR operator', () => {
    const result = parse('first XOR second AND third OR fourth');

    expect(result).toEqual({
      value: {
        left: {
          value: {
            left: {
              value: {
                left: {
                  value: 'first',
                  inverted: false,
                },
                right: {
                  value: 'second',
                  inverted: false,
                },
                operator: Operators.XOR,
              },
              inverted: false,
            },
            right: {
              value: 'third',
              inverted: false,
            },
            operator: Operators.AND,
          },
          inverted: false,
        },
        right: {
          value: 'fourth',
          inverted: false,
        },
        operator: Operators.OR,
      },
      inverted: false,
    });
  });

  test('should parse an expression with an OR then an AND operator', () => {
    const result = parse('first OR second AND third');

    expect(result).toEqual({
      value: {
        left: {
          value: 'first',
          inverted: false,
        },
        right: {
          value: {
            left: {
              value: 'second',
              inverted: false,
            },
            right: {
              value: 'third',
              inverted: false,
            },
            operator: Operators.AND,
          },
          inverted: false,
        },
        operator: Operators.OR,
      },
      inverted: false,
    });
  });

  test('should parse an expression with an AND then an XOR then an OR operator', () => {
    const result = parse('first AND second XOR third OR fourth');

    // console.log(JSON.stringify(result, null, 2));

    expect(result).toEqual({
      value: {
        left: {
          value: {
            left: {
              value: 'first',
              inverted: false,
            },
            right: {
              value: {
                left: {
                  value: 'second',
                  inverted: false,
                },
                right: {
                  value: 'third',
                  inverted: false,
                },
                operator: Operators.XOR,
              },
              inverted: false,
            },
            operator: Operators.AND,
          },
          inverted: false,
        },
        right: {
          value: 'fourth',
          inverted: false,
        },
        operator: Operators.OR,
      },
      inverted: false,
    });
  });

  test('should parse an expression with an OR then an AND then an XOR operator', () => {
    const result = parse('first OR second AND third XOR fourth');

    console.log(JSON.stringify(result, null, 2));

    expect(result).toEqual({
      value: {
        left: {
          value: 'first',
          inverted: false,
        },
        right: {
          value: {
            left: {
              value: 'second',
              inverted: false,
            },
            right: {
              value: {
                left: {
                  value: 'third',
                  inverted: false,
                },
                right: {
                  value: 'fourth',
                  inverted: false,
                },
                operator: Operators.XOR,
              },
              inverted: false,
            },
            operator: Operators.AND,
          },
          inverted: false,
        },
        operator: Operators.OR,
      },
      inverted: false,
    });
  });
});
