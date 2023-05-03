import { type Board, CheckerPieceType, Player, type Move } from '../types';

export const initializeBoard = (): CheckerPieceType[][] => {
  return Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 8 }, (_, col) => {
      if ((row + col) % 2 === 1) {
        if (row < 3) {
          return CheckerPieceType.BLACK;
        } else if (row > 4) {
          return CheckerPieceType.WHITE;
        }
      }
      return CheckerPieceType.EMPTY;
    }),
  );
};

const isWithinBounds = (row: number, col: number, board: Board): boolean =>
  row >= 0 && row < board.length && col >= 0 && col < board[row].length;

const isInBounds = (board: Board, row: number, col: number): boolean => {
  return row >= 0 && row < board.length && col >= 0 && col < board[row].length;
};

export function applyMove(
  board: Board,
  moveFrom: Move,
  moveTo: Move,
): { newBoard: Board; captured: number } {
  const newBoard: Board = board.map((row) => [...row]);

  const { row: fromRow, col: fromCol } = moveFrom;
  const { row: toRow, col: toCol } = moveTo;

  const movingPiece = newBoard[fromRow][fromCol];
  const player = movingPiece % 2 === 0 ? Player.BLACK : Player.WHITE;

  newBoard[toRow][toCol] = movingPiece;
  newBoard[fromRow][fromCol] = CheckerPieceType.EMPTY;

  const capturedSequences = isCaptureMove(board, moveFrom, moveTo, player);
  const capturedPieces =
    capturedSequences.length > 0 ? capturedSequences[0] : [];

  if (capturedPieces.length > 0) {
    for (const { row, col } of capturedPieces) {
      newBoard[row][col] = CheckerPieceType.EMPTY;
    }
  }

  if (movingPiece === Player.BLACK && toRow === board.length - 1) {
    newBoard[toRow][toCol] += 2;
  }

  if (
    (movingPiece === Player.WHITE && toRow === 0) ||
    (movingPiece === Player.BLACK && toRow === board.length - 1)
  ) {
    newBoard[toRow][toCol] = movingPiece + 2;
  }

  return { newBoard, captured: capturedPieces.length };
}

export const isCaptureMove = (
  board: Board,
  moveFrom: Move,
  moveTo: Move,
  player: Player,
): Move[][] => {
  const opponent = player === Player.BLACK ? Player.WHITE : Player.BLACK;
  const directions = [
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: -1, dc: -1 },
  ];

  const findCapturedPieces = (
    board: Board,
    current: Move,
    target: Move,
    captured: Move[],
  ): Move[][] | [] => {
    if (current.row === target.row && current.col === target.col) {
      return [captured];
    }

    const captureSequences: Move[][] = [];

    for (const { dr, dc } of directions) {
      const newRow = current.row + 2 * dr;
      const newCol = current.col + 2 * dc;
      const newCurrent = { row: newRow, col: newCol };

      const betweenRow = current.row + dr;
      const betweenCol = current.col + dc;
      const betweenPiece = board[betweenRow]?.[betweenCol];

      if (
        isWithinBounds(newRow, newCol, board) &&
        (betweenPiece === opponent || betweenPiece === opponent + 2) &&
        !captured.some(
          ({ row, col }) => row === betweenRow && col === betweenCol,
        )
      ) {
        const newCaptured = [...captured, { row: betweenRow, col: betweenCol }];
        const newSequences = findCapturedPieces(
          board,
          newCurrent,
          target,
          newCaptured,
        );
        captureSequences.push(...newSequences);
      }
    }

    return captureSequences;
  };

  const captureSequences = findCapturedPieces(board, moveFrom, moveTo, []);
  return captureSequences.length > 0
    ? [captureSequences.sort((a, b) => b.length - a.length)[0]]
    : [];
};

function generateMoves(
  board: Board,
  row: number,
  col: number,
  player: Player,
  directions: number[][],
  capturing: boolean,
  captured = new Set<string>(),
): Move[] {
  const moves: Move[] = [];

  for (const [dx, dy] of directions) {
    const newRow = row + (capturing ? 2 * dx : dx);
    const newCol = col + (capturing ? 2 * dy : dy);

    if (isInBounds(board, newRow, newCol)) {
      if (board[newRow][newCol] === CheckerPieceType.EMPTY) {
        if (capturing) {
          const middleRow = row + dx;
          const middleCol = col + dy;
          const middlePiece = board[middleRow][middleCol];

          if (
            (middlePiece === (player % 2) + 1 ||
              middlePiece === (player % 2) + 3) &&
            !captured.has(`${middleRow},${middleCol}`)
          ) {
            const newCaptured = new Set(captured);
            newCaptured.add(`${middleRow},${middleCol}`);
            const furtherCaptures = generateMoves(
              board,
              newRow,
              newCol,
              player,
              directions,
              capturing,
              newCaptured,
            );

            if (furtherCaptures.length > 0) {
              for (const move of furtherCaptures) {
                moves.push({
                  row: newRow,
                  col: newCol,
                  captured: newCaptured,
                  next: move,
                });
              }
            } else {
              moves.push({ row: newRow, col: newCol, captured: newCaptured });
            }
          }
        } else {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  return moves;
}

export function generateLegalMovesForPlayer(
  board: Board,
  player: Player,
): Record<string, Move[]> {
  const legalMoves: Record<string, Move[]> = {};
  const captureMoves: Record<string, Move[]> = {};

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];

      if ((piece - player) % 2 === 0 && piece !== CheckerPieceType.EMPTY) {
        const directions =
          player === Player.WHITE
            ? [
                [-1, -1],
                [-1, 1],
              ]
            : [
                [1, -1],
                [1, 1],
              ];

        if (piece === player + 2) {
          // Add king's opposite directions
          directions.push(
            ...(player === Player.WHITE
              ? [
                  [1, -1],
                  [1, 1],
                ]
              : [
                  [-1, -1],
                  [-1, 1],
                ]),
          );
        }

        // Generate capture moves
        const captures = generateMoves(
          board,
          row,
          col,
          player,
          directions,
          true,
        );

        if (captures.length > 0) {
          captureMoves[`${row},${col}`] = captures;
        } else {
          // Generate non-capture moves
          const moves = generateMoves(
            board,
            row,
            col,
            player,
            directions,
            false,
          );
          legalMoves[`${row},${col}`] = moves;
        }
      }
    }
  }

  return Object.keys(captureMoves).length > 0 ? captureMoves : legalMoves;
}
