export enum CheckerPieceType {
  EMPTY = 0,
  WHITE = 1,
  BLACK = 2,
  WHITE_KING = 3,
  BLACK_KING = 4,
}

export interface BoardPiece {
  piece: CheckerPieceType;
  id: string;
}

export type Board = number[][];

export enum Player {
  WHITE = 1,
  BLACK = 2,
}

export interface Move {
  row: number;
  col: number;
  captured?: Set<string>;
  next?: Move;
}

export type Score = {
  [K in Player]: number;
};

export interface GameState {
  board: CheckerPieceType[][];
  selectedPiece: { row: number; col: number } | null;
  activePlayer: Player;
  possiblePlayerMovements: Record<string, Move[]> | null;
  score: Score;
  stats: {
    isOver: boolean;
    winner?: Player;
  };
}

export type GameAction =
  | { type: 'SET_BOARD'; board: CheckerPieceType[][] }
  | {
      type: 'SET_SELECTED_PIECE';
      selectedPiece: { row: number; col: number } | null;
    }
  | { type: 'SET_ACTIVE_PLAYER'; activePlayer: Player }
  | {
      type: 'SET_POSSIBLE_PLAYER_MOVEMENTS';
      possiblePlayerMovements: Record<string, Move[]>;
    }
  | { type: 'SET_SCORE'; score: { 1: number; 2: number } }
  | {
      type: 'APPLY_MOVE';
      activePlayer: Player;
      board: CheckerPieceType[][];
      score: { player: Player; update: number } | null;
    }
  | { type: 'RESET' }
  | { type: 'SET_IS_OVER' };
