import { describe, it, expect } from 'vitest';
import { createBoard, isValidPosition, placePiece, clearLines } from './board';
import { createPiece, getPieceCells } from './pieces';

describe('createBoard', () => {
  it('creates a 24-row x 10-col grid', () => {
    const board = createBoard();
    expect(board.length).toBe(24);
    board.forEach(row => {
      expect(row.length).toBe(10);
    });
  });

  it('all cells are null', () => {
    const board = createBoard();
    board.forEach(row => {
      row.forEach(cell => {
        expect(cell).toBeNull();
      });
    });
  });
});

describe('isValidPosition', () => {
  it('returns true for a piece at a valid position', () => {
    const board = createBoard();
    const piece = createPiece('T', 3);
    expect(isValidPosition(board, piece)).toBe(true);
  });

  it('returns false when piece is out of bounds (left)', () => {
    const board = createBoard();
    const piece = { type: 'T' as const, position: { x: -1, y: 5 }, rotation: 0 as const };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('returns false when piece is out of bounds (right)', () => {
    const board = createBoard();
    const piece = { type: 'T' as const, position: { x: 9, y: 5 }, rotation: 0 as const };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('returns false when piece is out of bounds (bottom)', () => {
    const board = createBoard();
    const piece = { type: 'T' as const, position: { x: 4, y: 23 }, rotation: 0 as const };
    expect(isValidPosition(board, piece)).toBe(false);
  });

  it('returns false when piece overlaps occupied cell', () => {
    const board = createBoard();
    // Place an I piece at the bottom first
    const ipiece = createPiece('I', 3);
    const placed = placePiece(board, { ...ipiece, position: { x: 3, y: 22 } });
    // Try placing T on same row
    const tpiece = { type: 'T' as const, position: { x: 3, y: 21 }, rotation: 0 as const };
    expect(isValidPosition(placed, tpiece)).toBe(false);
  });
});

describe('placePiece', () => {
  it('writes piece cells to board without mutating original', () => {
    const board = createBoard();
    const piece = { type: 'I' as const, position: { x: 3, y: 22 }, rotation: 0 as const };
    const newBoard = placePiece(board, piece);

    // Original board unchanged
    const cells = getPieceCells(piece);
    cells.forEach(({ x, y }) => {
      if (y >= 0 && y < 24) {
        expect(board[y][x]).toBeNull();
      }
    });

    // New board has piece
    cells.forEach(({ x, y }) => {
      if (y >= 0 && y < 24) {
        expect(newBoard[y][x]).toBe('I');
      }
    });
  });
});

describe('clearLines', () => {
  it('removes full rows and shifts rows down', () => {
    let board = createBoard();
    // Fill the bottom row (row 23) with I pieces
    for (let col = 0; col < 10; col++) {
      board = placePiece(board, { type: 'I' as const, position: { x: col, y: 23 }, rotation: 0 as const });
    }
    const result = clearLines(board);
    expect(result.linesCleared).toBe(1);
    // Bottom row should now be null
    result.board[23].forEach(cell => {
      expect(cell).toBeNull();
    });
  });

  it('returns linesCleared=0 when no full rows', () => {
    const board = createBoard();
    const result = clearLines(board);
    expect(result.linesCleared).toBe(0);
  });

  it('clears multiple full rows', () => {
    let board = createBoard();
    // Fill bottom 4 rows
    for (let row = 20; row < 24; row++) {
      for (let col = 0; col < 10; col++) {
        board = placePiece(board, { type: 'O' as const, position: { x: col, y: row }, rotation: 0 as const });
      }
    }
    const result = clearLines(board);
    expect(result.linesCleared).toBe(4);
  });
});
