// Position on the board
export interface Position { x: number; y: number; }

// Rotation states (0=spawn, 1=CW, 2=180, 3=CCW)
export type Rotation = 0 | 1 | 2 | 3;

// Direction for movement
export type Direction = 'left' | 'right' | 'down';

// Piece types
export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// Active piece state
export interface Piece {
  type: PieceType;
  position: Position;  // top-left of bounding box
  rotation: Rotation;
}

// Cell is null (empty) or a piece type (for color)
export type Cell = PieceType | null;

// Board is 10 columns x 20 visible rows (+ 2-4 hidden rows above)
export type BoardState = Cell[][];  // [row][col], row 0 = top

// Scoring event types
export type ClearType = 'single' | 'double' | 'triple' | 'tetris';
export type ScoreEvent = ClearType | 'tspin-single' | 'tspin-double' | 'tspin-triple' | 'tspin-mini' | 'combo' | 'back-to-back';

// Full game state (serializable for multiplayer)
export interface GameState {
  board: BoardState;
  currentPiece: Piece | null;
  holdPiece: PieceType | null;
  holdUsed: boolean;  // can only hold once per piece
  nextQueue: PieceType[];  // at least 5 pieces
  score: number;
  level: number;
  linesCleared: number;
  combo: number;  // -1 = no combo, 0+ = consecutive clears
  backToBack: boolean;  // last clear was tetris or t-spin
  isGameOver: boolean;
  elapsedMs: number;
}
