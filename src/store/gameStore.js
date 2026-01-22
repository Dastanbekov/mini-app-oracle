import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getUserId = () => {
    // Try Telegram WebApp
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) return tgUser.id;
    // Fallback for dev
    return 12345;
};

export const useGameStore = create((set, get) => ({
    balanceDust: 0,
    balanceCoins: 0,
    energy: 5,
    maxEnergy: 5,
    userId: getUserId(),
    inventory: [],

    syncUser: async () => {
        try {
            const res = await fetch(`${API_URL}/energy/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: get().userId })
            });
            const data = await res.json();
            if (data.energy !== undefined) {
                set({ energy: data.energy, balanceDust: data.balance_dust || 0 }); // API should return dust too
            }
        } catch (e) {
            console.error("Sync failed", e);
        }
    },

    playCups: async (choice) => {
        try {
            const res = await fetch(`${API_URL}/game/cups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: get().userId, choice })
            });
            const data = await res.json();
            if (data.energy !== undefined) {
                set({
                    energy: data.energy,
                    balanceDust: data.balance_dust
                });
            }
            return data;
        } catch (e) {
            console.error(e);
            return { error: "Network error" };
        }
    },

    playFog: async () => {
        try {
            const res = await fetch(`${API_URL}/game/fog`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: get().userId })
            });
            const data = await res.json();
            if (data.balance_dust !== undefined) {
                set({ balanceDust: data.balance_dust });
            }
            return data;
        } catch (e) {
            console.error(e);
            return { error: "Network error" };
        }
    }
}))
