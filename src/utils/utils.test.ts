import { CheckerPieceType, Player, type Board, type Move } from 'types';
import {
  initializeBoard,
  generateLegalMovesForPlayer,
  applyMove,
  isCaptureMove,
} from './index';
const board: Board = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
];

const boardWithMove: Board = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 0, 0, 2],
  [0, 0, 0, 0, 2, 0, 0, 0],
  [0, 1, 0, 0, 0, 2, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
];

const doubleCaptureBoard: Board = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 2, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
];

describe('initializeBoard', () => {
  it('should initialize a checker board', () => {
    const newBoard = initializeBoard();

    expect(newBoard).toHaveLength(8);
    newBoard.forEach((row) => expect(row).toHaveLength(8));

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        expect(newBoard[row][col]).toEqual(board[row][col]);
      }
    }
  });
});

describe('generateLegalMovesForPlayer', () => {
  it('should return legal moves for white player', () => {
    const whiteLegalMoves = generateLegalMovesForPlayer(board, Player.WHITE);

    const expectedWhiteMoves: Record<string, Move[]> = {
      '5,0': [{ row: 4, col: 1 }],
      '5,2': [
        { row: 4, col: 1 },
        { row: 4, col: 3 },
      ],
      '5,4': [
        { row: 4, col: 3 },
        { row: 4, col: 5 },
      ],
      '5,6': [
        { row: 4, col: 5 },
        { row: 4, col: 7 },
      ],
      '6,1': [],
      '6,3': [],
      '6,5': [],
      '6,7': [],
      '7,0': [],
      '7,2': [],
      '7,4': [],
      '7,6': [],
    };

    expect(whiteLegalMoves).toEqual(expectedWhiteMoves);
  });

  it('should return legal moves for black player', () => {
    const blackLegalMoves = generateLegalMovesForPlayer(board, Player.BLACK);

    const expectedBlackMoves: Record<string, Move[]> = {
      '0,1': [],
      '0,3': [],
      '0,5': [],
      '0,7': [],
      '1,0': [],
      '1,2': [],
      '1,4': [],
      '1,6': [],
      '2,1': [
        { row: 3, col: 0 },
        { row: 3, col: 2 },
      ],
      '2,3': [
        { row: 3, col: 2 },
        { row: 3, col: 4 },
      ],
      '2,5': [
        { row: 3, col: 4 },
        { row: 3, col: 6 },
      ],
      '2,7': [{ row: 3, col: 6 }],
    };

    expect(blackLegalMoves).toEqual(expectedBlackMoves);
  });
});

describe('isCaptureMove', () => {
  test('isCaptureMove detects a capture move', () => {
    const moveFrom: Move = { row: 5, col: 4 };
    const moveTo: Move = { row: 3, col: 6 };

    const captureResult = isCaptureMove(
      boardWithMove,
      moveFrom,
      moveTo,
      Player.WHITE,
    );

    expect(captureResult.length).toBeGreaterThan(0);
  });

  test('isCaptureMove detects a double capture move', () => {
    const moveFrom: Move = { row: 5, col: 4 };
    const moveTo: Move = { row: 1, col: 4 };

    const captureResult = isCaptureMove(
      doubleCaptureBoard,
      moveFrom,
      moveTo,
      Player.WHITE,
    );

    expect(captureResult.length).toBeGreaterThan(0);
    expect(captureResult[0].length).toBe(2);
  });
});

describe('applyMove', () => {
  test('applyMove moves a piece and captures an opponent', () => {
    const moveFrom: Move = { row: 5, col: 4 };
    const moveTo: Move = { row: 3, col: 6 };

    const applyMoveResult = applyMove(boardWithMove, moveFrom, moveTo);

    expect(applyMoveResult.captured).toBe(1);
    expect(applyMoveResult.newBoard[moveFrom.row][moveFrom.col]).toBe(
      CheckerPieceType.EMPTY,
    );
    expect(applyMoveResult.newBoard[moveTo.row][moveTo.col]).toBe(Player.WHITE);
    expect(applyMoveResult.newBoard[4][5]).toBe(CheckerPieceType.EMPTY);
  });

  //
  test('applyMove moves a piece and captures two opponents in a double capture move', () => {
    const moveFrom: Move = { row: 5, col: 4 };
    const moveTo: Move = { row: 1, col: 4 };

    const applyMoveResult = applyMove(doubleCaptureBoard, moveFrom, moveTo);

    expect(applyMoveResult.captured).toBe(2);
    expect(applyMoveResult.newBoard[moveFrom.row][moveFrom.col]).toBe(
      CheckerPieceType.EMPTY,
    );
    expect(applyMoveResult.newBoard[moveTo.row][moveTo.col]).toBe(Player.WHITE);
    expect(applyMoveResult.newBoard[4][5]).toBe(CheckerPieceType.EMPTY);
    expect(applyMoveResult.newBoard[2][5]).toBe(CheckerPieceType.EMPTY);
  });
});
