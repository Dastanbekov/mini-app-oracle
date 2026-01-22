import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Coins, Zap } from 'lucide-react';
import GameCups from '../components/rituals/GameCups';
import GameFog from '../components/rituals/GameFog';

export default function Rituals() {
    const { balanceDust, energy, maxEnergy, syncUser } = useGameStore();
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
            <div className="w-full glass-card rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                        <Dna size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Пыль</p>
                        <h2 className="text-xl font-bold font-display text-white">{balanceDust}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Энергия</p>
                        <h2 className="text-xl font-bold font-display text-accent">{energy}/{maxEnergy}</h2>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <Zap size={20} />
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
