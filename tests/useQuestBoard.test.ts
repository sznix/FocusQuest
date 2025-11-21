import { renderHook, act } from '@testing-library/react';
import { useQuestBoard } from '../hooks/useQuestBoard';
import { Quest } from '../types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useQuestBoard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useQuestBoard());
    expect(result.current.quests).toEqual([]);
    expect(result.current.playerStats.level).toBe(1);
    expect(result.current.playerStats.currentXp).toBe(0);
  });

  it('should add a quest', () => {
    const { result } = renderHook(() => useQuestBoard());
    const newQuest: Quest = {
      id: '1',
      title: 'Test Quest',
      difficulty: 'Normal',
      status: 'Backlog',
      xpReward: 50
    };

    act(() => {
      result.current.addQuest(newQuest);
    });

    expect(result.current.quests).toHaveLength(1);
    expect(result.current.quests[0]).toEqual(newQuest);
  });

  it('should update quest status and award XP when moving to Doing', () => {
    const { result } = renderHook(() => useQuestBoard());
    const newQuest: Quest = {
      id: '1',
      title: 'Test Quest',
      difficulty: 'Normal',
      status: 'Backlog',
      xpReward: 50
    };

    act(() => {
      result.current.addQuest(newQuest);
    });

    act(() => {
      result.current.updateQuestStatus('1', 'Doing');
    });

    expect(result.current.quests[0].status).toBe('Doing');
    // XP for Start Quest is 10
    expect(result.current.playerStats.currentXp).toBe(10);
  });

  it('should update quest status and award XP when moving to Done', () => {
    const { result } = renderHook(() => useQuestBoard());
    const newQuest: Quest = {
      id: '1',
      title: 'Test Quest',
      difficulty: 'Normal',
      status: 'Doing',
      xpReward: 50
    };

    act(() => {
      result.current.addQuest(newQuest);
    });

    act(() => {
      result.current.updateQuestStatus('1', 'Done');
    });

    expect(result.current.quests[0].status).toBe('Done');
    // XP for Complete Quest is 50
    expect(result.current.playerStats.currentXp).toBe(50);
  });

  it('should delete a quest', () => {
    const { result } = renderHook(() => useQuestBoard());
    const newQuest: Quest = {
      id: '1',
      title: 'Test Quest',
      difficulty: 'Normal',
      status: 'Backlog',
      xpReward: 50
    };

    act(() => {
      result.current.addQuest(newQuest);
    });

    act(() => {
      result.current.deleteQuest('1');
    });

    expect(result.current.quests).toHaveLength(0);
  });

  it('should level up when XP threshold is reached', () => {
    const { result } = renderHook(() => useQuestBoard());
    // Base XP to level is 100.
    // We need to simulate adding enough XP.
    // Let's say we move 3 quests from Doing to Done (50 XP each = 150 XP)

    const q1: Quest = { id: '1', title: 'Q1', difficulty: 'Normal', status: 'Doing', xpReward: 50 };
    const q2: Quest = { id: '2', title: 'Q2', difficulty: 'Normal', status: 'Doing', xpReward: 50 };
    const q3: Quest = { id: '3', title: 'Q3', difficulty: 'Normal', status: 'Doing', xpReward: 50 };

    act(() => {
      result.current.addQuest(q1);
      result.current.addQuest(q2);
      result.current.addQuest(q3);
    });

    act(() => {
      result.current.updateQuestStatus('1', 'Done'); // +50 XP
    });
    expect(result.current.playerStats.level).toBe(1);
    expect(result.current.playerStats.currentXp).toBe(50);

    act(() => {
      result.current.updateQuestStatus('2', 'Done'); // +50 XP = 100 XP -> Level Up!
    });

    // Level should be 2
    // XP should be 0 (100 - 100)
    // Next level XP should scale (100 * 1.5 = 150)
    expect(result.current.playerStats.level).toBe(2);
    expect(result.current.playerStats.currentXp).toBe(0);
    expect(result.current.playerStats.xpToNextLevel).toBe(150);

    act(() => {
      result.current.updateQuestStatus('3', 'Done'); // +50 XP
    });
    expect(result.current.playerStats.level).toBe(2);
    expect(result.current.playerStats.currentXp).toBe(50);
  });
});
