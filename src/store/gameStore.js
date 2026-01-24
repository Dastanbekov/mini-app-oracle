import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const getUserId = () => {
    // Try Telegram WebApp
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    console.log('[DEBUG] Telegram initDataUnsafe:', window.Telegram?.WebApp?.initDataUnsafe);
    console.log('[DEBUG] Telegram user:', tgUser);
    if (tgUser) return tgUser.id;
    // Fallback for dev
    console.log('[DEBUG] Using fallback user_id: 12345');
    return 12345;
};

export const useGameStore = create((set, get) => ({
    balanceDust: 0,
    balanceCoins: 0,
    balanceFlowers: 0,
    balanceTarotCoins: 0.0,
    energy: 5,
    maxEnergy: 5,
    nextEnergyTime: null,
    userId: getUserId(),
    inventory: [],

    // Payment state
    currentPayment: null,
    paymentLoading: false,

    syncUser: async () => {
        try {
            const res = await fetch(`${API_URL}/energy/check?user_id=${get().userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.energy !== undefined) {
                set({
                    energy: data.energy,
                    maxEnergy: data.max_energy || 5,
                    nextEnergyTime: data.next_energy_time || null,
                    balanceDust: data.balance_dust || 0,
                    balanceFlowers: data.balance_flowers || 0,
                    balanceTarotCoins: data.balance_tarot_coins || 0.0
                });
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
                    balanceDust: data.balance_dust,
                    balanceFlowers: data.balance_flowers
                });
            }
            return data;
        } catch (e) {
            console.error(e);
            return { error: "Network error" };
        }
    },

    exchangeFlowers: async (amount) => {
        try {
            const res = await fetch(`${API_URL}/exchange`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: get().userId, amount: parseInt(amount) })
            });
            const data = await res.json();
            if (data.balance_flowers !== undefined) {
                set({
                    balanceFlowers: data.balance_flowers,
                    balanceTarotCoins: data.balance_tarot_coins
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
    },

    // ==================== Payment Functions ====================

    /**
     * Create a payment via YooKassa
     * @param {string} productType - 'test_result', 'matrix_reading', 'custom_reading'
     * @param {string} customAmount - Optional custom amount for special products
     * @returns {Object} - { success, payment_id, confirmation_url } or { error }
     */
    createPayment: async (productType, customAmount = null) => {
        set({ paymentLoading: true });
        try {
            const body = {
                user_id: get().userId,
                product_type: productType
            };
            if (customAmount) {
                body.amount = customAmount;
            }

            const res = await fetch(`${API_URL}/payment/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                set({ currentPayment: data, paymentLoading: false });
            } else {
                set({ paymentLoading: false });
            }

            return data;
        } catch (e) {
            console.error("Payment creation failed:", e);
            set({ paymentLoading: false });
            return { error: "Network error" };
        }
    },

    /**
     * Check status of a payment
     * @param {string} paymentId - YooKassa payment ID
     * @returns {Object} - { payment_id, status, paid } or { error }
     */
    checkPaymentStatus: async (paymentId) => {
        try {
            const res = await fetch(`${API_URL}/payment/status/${paymentId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            return data;
        } catch (e) {
            console.error("Payment status check failed:", e);
            return { error: "Network error" };
        }
    },

    /**
     * Open payment URL - for Telegram WebApp
     * Uses Telegram.WebApp.openLink for proper behavior
     * @param {string} url - Payment confirmation URL
     */
    openPaymentUrl: (url) => {
        if (window.Telegram?.WebApp?.openLink) {
            // Use Telegram's method for external links
            window.Telegram.WebApp.openLink(url);
        } else {
            // Fallback for browser
            window.open(url, '_blank');
        }
    },

    clearPayment: () => {
        set({ currentPayment: null });
    }
}))

