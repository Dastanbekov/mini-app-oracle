import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Coins, Zap, Plus, Flower2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import GameCups from '../components/rituals/GameCups';
import GameFog from '../components/rituals/GameFog';

export default function Rituals() {
    const { balanceDust, balanceFlowers, balanceTarotCoins, energy, maxEnergy, syncUser } = useGameStore();
    const [activeTab, setActiveTab] = useState('cups');

    useEffect(() => {
        syncUser();
        // Poll energy every minute
        const interval = setInterval(syncUser, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center min-h-[80vh] gap-6 pb-20">
            {/* Header Stats */}
            <div className="w-full glass-card rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-accent/5" />

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    {/* Top Left: Pollen (Dust) */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <Dna size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Пыльца</p>
                            <div className="flex items-center gap-1">
                                <h2 className="text-lg font-bold font-display text-white">{balanceDust}</h2>
                                <Link to="/shop" className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-primary hover:text-white transition-colors">
                                    <Plus size={10} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Top Right: Energy */}
                    <div className="flex items-center justify-end gap-2">
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Энергия</p>
                            <div className="flex items-center gap-1">
                                <Link to="/shop" className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:bg-accent hover:text-white transition-colors">
                                    <Plus size={10} />
                                </Link>
                                <h2 className="text-lg font-bold font-display text-accent">{energy}/{maxEnergy}</h2>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                            <Zap size={16} />
                        </div>
                    </div>

                    {/* Bottom Left: Flowers */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
                            <Flower2 size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Цветы</p>
                            <h2 className="text-lg font-bold font-display text-white">{balanceFlowers || 0}</h2>
                        </div>
                    </div>

                    {/* Bottom Right: Tarot Coins */}
                    <div className="flex items-center justify-end gap-2">
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Таро</p>
                            <h2 className="text-lg font-bold font-display text-yellow-400">{balanceTarotCoins?.toFixed(2) || '0.00'}</h2>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                            <span className="font-bold text-xs">TC</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white/5 rounded-xl p-1 flex w-full">
                <button
                    onClick={() => setActiveTab('cups')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'cups' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Чаши Судьбы
                </button>
                <button
                    onClick={() => setActiveTab('fog')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'fog' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Туман Таро
                </button>
            </div>

            {/* Game Content */}
            <div className="w-full flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {activeTab === 'cups' ? <GameCups /> : <GameFog />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
