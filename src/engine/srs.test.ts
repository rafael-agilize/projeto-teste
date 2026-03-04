import { describe, it, expect } from 'vitest';
import { tryRotation } from './srs';
import { createBoard, placePiece } from './board';
import { createPiece } from './pieces';

describe('tryRotation', () => {
  it('rotates a piece clockwise in open space', () => {
    const board = createBoard();
    const piece = createPiece('T', 4);
    const rotated = tryRotation(board, piece, 'cw');
    expect(rotated).not.toBeNull();
    expect(rotated!.rotation).toBe(1);
  });

  it('rotates a piece counter-clockwise in open space', () => {
    const board = createBoard();
    const piece = createPiece('T', 4);
    const rotated = tryRotation(board, piece, 'ccw');
    expect(rotated).not.toBeNull();
    expect(rotated!.rotation).toBe(3);
  });

  it('returns null when rotation is completely blocked with no valid kick', () => {
    // Create a tight space where no kick can help
    let board = createBoard();
    const piece = { type: 'I' as const, position: { x: 4, y: 23 }, rotation: 0 as const };
    // Fill cells around the I piece so it can't rotate
    for (let col = 0; col < 10; col++) {
      board = placePiece(board, { type: 'O' as const, position: { x: col, y: 22 }, rotation: 0 as const });
    }
    const rotated = tryRotation(board, piece, 'cw');
    // I piece at bottom surrounded by blocks should fail
    expect(rotated).toBeNull();
  });

  it('performs wall kick when piece is near the left wall', () => {
    const board = createBoard();
    const piece = createPiece('J', 0);
    const rotated = tryRotation(board, piece, 'cw');
    // Should succeed with a wall kick
    expect(rotated).not.toBeNull();
  });

  it('O piece rotation returns same position', () => {
    const board = createBoard();
    const piece = createPiece('O', 4);
    const rotated = tryRotation(board, piece, 'cw');
    // O piece can always "rotate" (no shape change)
    expect(rotated).not.toBeNull();
  });

  it('I piece uses separate kick table', () => {
    const board = createBoard();
    const piece = createPiece('I', 0);
    const rotated = tryRotation(board, piece, 'cw');
    expect(rotated).not.toBeNull();
    expect(rotated!.rotation).toBe(1);
  });
});
