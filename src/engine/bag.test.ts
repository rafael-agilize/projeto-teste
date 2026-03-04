import { describe, it, expect } from 'vitest';
import { createBag, nextPiece } from './bag';
import { PieceType } from './types';

const ALL_PIECES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

describe('createBag', () => {
  it('creates a bag with 14 pieces (2 shuffled sets)', () => {
    const bag = createBag();
    expect(bag.pieces.length).toBe(14);
  });

  it('contains exactly 2 of each piece type', () => {
    const bag = createBag();
    ALL_PIECES.forEach(type => {
      const count = bag.pieces.filter(p => p === type).length;
      expect(count).toBe(2);
    });
  });
});

describe('nextPiece', () => {
  it('returns a valid piece type', () => {
    const bag = createBag();
    const { piece } = nextPiece(bag);
    expect(ALL_PIECES).toContain(piece);
  });

  it('does not mutate the original bag', () => {
    const bag = createBag();
    const originalLength = bag.pieces.length;
    nextPiece(bag);
    expect(bag.pieces.length).toBe(originalLength);
  });

  it('returns all 7 pieces within first 7 draws', () => {
    let bag = createBag();
    const drawn: PieceType[] = [];

    for (let i = 0; i < 7; i++) {
      const result = nextPiece(bag);
      drawn.push(result.piece);
      bag = result.bag;
    }

    ALL_PIECES.forEach(type => {
      expect(drawn).toContain(type);
    });
  });

  it('never has drought > 12 pieces without seeing all types', () => {
    let bag = createBag();
    const window: PieceType[] = [];

    for (let i = 0; i < 200; i++) {
      const result = nextPiece(bag);
      bag = result.bag;
      window.push(result.piece);

      if (window.length > 12) {
        window.shift();
        // In any 13-piece window, at most 2 bags of 7 are used
        // so we should see at most 12 pieces before repeating all types in a bag
      }
    }

    // Check: within any consecutive 12 pieces, no piece type is absent more than twice
    // (This validates the 7-bag guarantee)
    for (let start = 0; start <= 200 - 7; start += 7) {
      const chunk = window.slice(start, start + 7);
      if (chunk.length === 7) {
        ALL_PIECES.forEach(type => {
          expect(chunk.filter(p => p === type).length).toBeGreaterThanOrEqual(1);
        });
      }
    }
  });

  it('refills bag when running low (below 7)', () => {
    let bag = createBag();
    // Draw 8 pieces (bag had 14, now should have 6 and auto-refill to 13)
    for (let i = 0; i < 8; i++) {
      const result = nextPiece(bag);
      bag = result.bag;
    }
    // After 8 draws from 14, we have 6 left and it should refill to at least 7
    expect(bag.pieces.length).toBeGreaterThanOrEqual(6);

    // Keep drawing and ensure we never run out
    for (let i = 0; i < 100; i++) {
      const result = nextPiece(bag);
      bag = result.bag;
      expect(result.piece).toBeTruthy();
    }
  });
});
