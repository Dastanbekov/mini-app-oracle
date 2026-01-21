import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useState } from 'react';
import { Zap, Coins } from 'lucide-react';

export default function Game() {
    const { balance, energy, maxEnergy, increment } = useGameStore();
    const [clicks, setClicks] = useState([]);

    const handleClick = (e) => {
        if (energy <= 0) return;

        increment();

        // Haptic feedback if available (Telegram)
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }

        // Create floating "+1"
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; // relative to button
        const y = e.clientY - rect.top;

        const newClick = {
            id: Date.now(),
            x: e.clientX, // fixed for screen
            y: e.clientY
        };
        setClicks(prev => [...prev, newClick]);

        // Cleanup
        setTimeout(() => {
            setClicks(prev => prev.filter(c => c.id !== newClick.id));
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] gap-10">

            {/* Stats Card */}
            <div className="w-full glass-card rounded-2xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                            <Coins size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Баланс</p>
                            <h2 className="text-2xl font-bold font-display text-white text-glow">{balance.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-right">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Энергия</p>
                            <h2 className="text-xl font-bold font-display text-accent">{energy}/{maxEnergy}</h2>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                            <Zap size={18} />
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-accent to-primary shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(energy / maxEnergy) * 100}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                    />
                </div>
            </div>

            {/* Main Button */}
            <div className="relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-[50px] animate-pulse-glow" />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                    disabled={energy <= 0}
                    className="relative w-64 h-64 rounded-full glass border-2 border-primary/30 shadow-[0_0_30px_rgba(217,70,239,0.2)] flex items-center justify-center overflow-hidden group disabled:opacity-50 disabled:grayscale transition-all"
                >
                    {/* Inner Ring */}
                    <div className="absolute inset-2 rounded-full border border-white/10 group-active:scale-95 transition-transform duration-100" />
                    <div className="absolute inset-[30px] rounded-full border border-white/5 animate-[spin_10s_linear_infinite]" />

                    {/* Icon/Image */}
                    <div className="text-8xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 animate-float">
                        🔮
                    </div>

                    {/* Click ripple effect logic could be added here */}
                </motion.button>
            </div>

            <AnimatePresence>
                {clicks.map(click => (
                    <motion.div
                        key={click.id}
                        initial={{ opacity: 1, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: -150, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="fixed text-4xl font-bold font-display text-secondary pointer-events-none z-50 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                        style={{ left: click.x, top: click.y }}
                    >
                        +1
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
