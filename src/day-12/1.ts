import { Matrix, Position, PositionId, toMatrix, toPositionId } from '../matrix';

let matrix: Matrix;

type Region = {
  area: number;
  perimeter: number;
};

type PositionData = {
  regionId: number;
  type: string;
  fences: FenceId[];
};

const positionsRecord: Record<PositionId, PositionData> = {};

type FenceId = `${PositionId}:${PositionId}`;

const toFenceId = (a: Position, b: Position): FenceId => {
  const [first, second] = [a, b].sort((_a, _b) => {
    if (_a.y === _b.y) return _a.x < _b.x ? -1 : 1;
    return _a.y < _b.y ? -1 : 1;
  });
  return `${first.x},${first.y}:${second.x},${second.y}`;
};

const addFence = (position: Position, neighborPosition: Position) => {
  positionsRecord[toPositionId(position)] = {
    ...positionsRecord[toPositionId(position)],
    fences: positionsRecord[toPositionId(position)].fences.concat(toFenceId(position, neighborPosition)),
  };
};

const findNeighbors = (position: Position, regionId: number): void => {
  if (positionsRecord[toPositionId(position)] !== undefined) return;

  const { x, y } = position;
  const plantType = matrix.at(position);

  positionsRecord[toPositionId(position)] = {
    regionId,
    type: plantType!,
    fences: [],
  };

  const neighborPositions: Position[] = [
    { x, y: y + 1 },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x: x - 1, y },
  ];

  for (let i = 0; i < neighborPositions.length; ++i) {
    const neighborPosition = neighborPositions[i];
    const neighborType = matrix.at(neighborPositions[i]);

    if (neighborType === plantType) {
      findNeighbors(neighborPosition, regionId);
    } else {
      addFence(position, neighborPosition);
    }
  }
};

const getRegions = (): Region[] =>
  Object.values(positionsRecord).reduce<Region[]>((acc, { fences, regionId }) => {
    acc[regionId] = {
      area: (acc[regionId]?.area ?? 0) + 1,
      perimeter: (acc[regionId]?.perimeter ?? 0) + fences.length,
    };
    return acc;
  }, []);

const run = (data: string) => {
  matrix = toMatrix(data);

  matrix.reducePositions((acc, cur, position, index) => {
    findNeighbors(position, index);
  });

  return getRegions().reduce((acc, { area, perimeter }) => acc + area * perimeter, 0);
};

export default run;
