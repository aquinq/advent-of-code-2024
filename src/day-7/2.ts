import { EmptyEquation, parseData, toNBaseArray } from './utils';

type Operator = '+' | '*' | '|';

const OperatorsByDigit: Record<number, Operator> = {
  0: '+',
  1: '*',
  2: '|',
};

const getOperators = (n: number, length: number): Operator[] => {
  const _3BaseArray = toNBaseArray(n, length, 3);
  return _3BaseArray.map((digit) => OperatorsByDigit[digit]);
};

const add = (a: number, b: number) => a + b;
const multiply = (a: number, b: number) => a * b;
const concatenate = (a: number, b: number) => Number(`${a}${b}`);

const fnByOp: Record<Operator, typeof add | typeof multiply> = {
  '+': add,
  '*': multiply,
  '|': concatenate,
};

const compute = (a: number, b: number, operator: Operator) => fnByOp[operator](a, b);

const computeOperands = ([a, b, ...rest]: number[], operators: Operator[]): number => {
  const result = compute(a, b, operators[0]);

  return rest.length === 0 ? result : computeOperands([result, ...rest], operators.slice(1));
};

const isValidEquation = ({ result, operands }: EmptyEquation) => {
  const operatorsLength = operands.length - 1;
  const permutationsCount = 3 ** operatorsLength;

  for (let i = 0; i < permutationsCount; i += 1) {
    const operators = getOperators(i, operatorsLength);
    if (computeOperands(operands, operators) === result) return true;
  }

  return false;
};

const run = (data: string) => {
  const emptyEquations: EmptyEquation[] = parseData(data);

  return emptyEquations.reduce((acc, cur, i) => {
    console.log({ i });
    return isValidEquation(cur) ? acc + cur.result : acc;
  }, 0);
};

export default run;
