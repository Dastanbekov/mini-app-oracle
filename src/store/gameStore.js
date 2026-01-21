import { create } from 'zustand'

export const useGameStore = create((set) => ({
    balance: 0,
    energy: 100,
    maxEnergy: 100,
    increment: () => set((state) => ({
        balance: state.balance + 1,
        energy: Math.max(0, state.energy - 1)
    })),
    restoreEnergy: () => set((state) => ({
        energy: Math.min(state.maxEnergy, state.energy + 10)
    })),
}))
