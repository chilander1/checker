import { CheckerPieceType } from 'types';

export const pieceColors: Record<CheckerPieceType, string> = {
  [CheckerPieceType.EMPTY]: '',
  [CheckerPieceType.WHITE]: 'white',
  [CheckerPieceType.BLACK]: 'black',
  [CheckerPieceType.WHITE_KING]: 'white',
  [CheckerPieceType.BLACK_KING]: 'black',
};
