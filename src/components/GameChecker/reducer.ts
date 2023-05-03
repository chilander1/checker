import { initializeBoard } from 'utils';
import { loadStateFromLocalStorage } from 'utils/localStorage';
import { type GameState, type GameAction } from 'types';

export const getInitialState: (isReset?: boolean) => GameState = (
  isReset?: boolean,
) => {
  const cached = !isReset ? loadStateFromLocalStorage() : null;
  return (
    cached ?? {
      board: initializeBoard(),
      selectedPiece: null,
      activePlayer: 1,
      possiblePlayerMovements: null,
      score: {
        1: 0,
        2: 0,
      },
      stats: {
        isOver: false,
      },
    }
  );
};

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_BOARD':
      return { ...state, board: action.board };
    case 'SET_SELECTED_PIECE':
      return { ...state, selectedPiece: action.selectedPiece };
    case 'SET_ACTIVE_PLAYER':
      return { ...state, activePlayer: action.activePlayer };
    case 'SET_POSSIBLE_PLAYER_MOVEMENTS':
      return {
        ...state,
        possiblePlayerMovements: action.possiblePlayerMovements,
      };
    case 'APPLY_MOVE': {
      const player = action?.score?.player;
      const update = action?.score?.update;
      const newScore = player && update && state.score[player] + update;
      const isOver = newScore === 12;

      return {
        ...state,
        activePlayer: action.activePlayer,
        board: action.board,
        score: player
          ? {
              ...state.score,
              [player]: newScore,
            }
          : { ...state.score },
        possiblePlayerMovements: null,
        selectedPiece: null,
        stats: {
          isOver,
          winner: isOver ? player : undefined,
        },
      };
    }
    case 'SET_SCORE': {
      return { ...state, score: action.score };
    }
    case 'SET_IS_OVER': {
      return {
        ...state,
        stats: {
          isOver: true,
        },
      };
    }
    case 'RESET':
      return getInitialState(true);

    default:
      throw new Error('Invalid action type');
  }
}
