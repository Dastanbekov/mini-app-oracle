import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShoppingCart, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useState, useEffect } from 'react';

export default function NoEnergyModal({ isOpen, onClose }) {
    const { energy, maxEnergy, nextEnergyTime } = useGameStore();
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!nextEnergyTime) return;

        const updateTimer = () => {
            const now = Date.now();
            const remaining = nextEnergyTime - now;

            if (remaining <= 0) {
                setTimeLeft('Скоро...');
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [nextEnergyTime]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="glass-card max-w-sm w-full p-6 rounded-2xl border border-red-500/30 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Zap size={32} className="text-red-400" />
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-display font-bold text-white mb-2">
                            Энергия закончилась!
                        </h2>

                        {/* Current energy */}
                        <p className="text-sm text-gray-400 mb-4">
                            У вас {energy} / {maxEnergy} энергии
                        </p>

                        {/* Timer */}
                        <div className="glass p-4 rounded-xl mb-4">
                            <div className="flex items-center justify-center gap-2 text-green-400">
                                <Clock size={18} />
                                <span className="text-sm">Следующая энергия через:</span>
                            </div>
                            <p className="text-2xl font-mono font-bold text-white mt-2">
                                {timeLeft || '...'}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-xs text-gray-500">или</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Buy button */}
                        <Link
                            to="/shop"
                            onClick={onClose}
                            className="block w-full py-3 px-6 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg shadow-green-500/20 hover:brightness-110 transition-all"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <ShoppingCart size={18} />
                                Купить энергию
                            </div>
                        </Link>

                        <p className="text-[10px] text-gray-500 mt-3">
                            5 энергии = 50 ⭐ (≈50₽)
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
