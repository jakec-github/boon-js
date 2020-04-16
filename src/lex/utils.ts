export const findNextMatch = (
  expression: string,
  characters: string[],
  returnOnMatch = true,
): number => {
  const charSet = new Set(characters);

  for (let i = 0; i < expression.length; i += 1) {
    if (charSet.has(expression[i]) === returnOnMatch) {
      return i;
    }
  }

  return expression.length;
};
