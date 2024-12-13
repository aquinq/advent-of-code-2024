import { Coordinates, Matrix, toMatrix } from '../matrix';

type Direction = '1.N' | '2.NE' | '3.E' | '4.SE' | '5.S' | '6.SO' | '7.O' | '8.NO';

const isValid = ({ x, y }: Coordinates, direction: Direction, at: Matrix['at']): boolean => {
  const startLetter = at(x, y);
  if (startLetter !== 'X') throw new Error(`Unexpected ${startLetter} at position ${x}, ${y}`);

  switch (direction) {
    case '1.N':
      return at(x, y - 1) === 'M' && at(x, y - 2) === 'A' && at(x, y - 3) === 'S';
    case '2.NE':
      return at(x + 1, y - 1) === 'M' && at(x + 2, y - 2) === 'A' && at(x + 3, y - 3) === 'S';
    case '3.E':
      return at(x + 1, y) === 'M' && at(x + 2, y) === 'A' && at(x + 3, y) === 'S';
    case '4.SE':
      return at(x + 1, y + 1) === 'M' && at(x + 2, y + 2) === 'A' && at(x + 3, y + 3) === 'S';
    case '5.S':
      return at(x, y + 1) === 'M' && at(x, y + 2) === 'A' && at(x, y + 3) === 'S';
    case '6.SO':
      return at(x - 1, y + 1) === 'M' && at(x - 2, y + 2) === 'A' && at(x - 3, y + 3) === 'S';
    case '7.O':
      return at(x - 1, y) === 'M' && at(x - 2, y) === 'A' && at(x - 3, y) === 'S';
    default:
      // 8.NO
      return at(x - 1, y - 1) === 'M' && at(x - 2, y - 2) === 'A' && at(x - 3, y - 3) === 'S';
  }
};

const run = (data: string) => {
  const word = 'XMAS';
  const matrix = toMatrix(data);
  const matrixSize = matrix.length;

  if (word.length > matrixSize) throw new Error('oh oh, word is too large');

  const startCoordinates = matrix.findAll('X');

  const getPossibleDirections = ({ x, y }: Coordinates): Direction[] => {
    const directions: Direction[] = [];

    const conditions: Record<string, boolean> = {
      n: y >= word.length,
      e: x <= matrixSize - (word.length - 1),
      s: y <= matrixSize - (word.length - 1),
      o: x >= word.length,
    };

    if (conditions.n) directions.push('1.N');
    if (conditions.n && conditions.e) directions.push('2.NE');
    if (conditions.e) directions.push('3.E');
    if (conditions.e && conditions.s) directions.push('4.SE');
    if (conditions.s) directions.push('5.S');
    if (conditions.s && conditions.o) directions.push('6.SO');
    if (conditions.o) directions.push('7.O');
    if (conditions.o && conditions.n) directions.push('8.NO');

    return directions;
  };

  return startCoordinates.reduce((acc, cur) => {
    const directions = getPossibleDirections(cur);
    const count = directions.reduce((acc2, cur2) => {
      const passes = isValid(cur, cur2, matrix.at);
      return passes ? acc2 + 1 : acc2;
    }, 0);
    return acc + count;
  }, 0);
};

export default run;
