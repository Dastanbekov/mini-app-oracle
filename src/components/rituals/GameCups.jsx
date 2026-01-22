import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Trophy, HelpCircle } from 'lucide-react';

export default function GameCups() {
    const { playCups, balanceDust, energy } = useGameStore();
    const [gameState, setGameState] = useState('idle'); // idle, shuffling, picking, result
    const [result, setResult] = useState(null);
    const [cupOrder, setCupOrder] = useState([1, 2, 3]);

    const handlePlay = async () => {
        if (energy < 1) return;
        setGameState('shuffling');

        // Simple shuffle animation
        let interval = setInterval(() => {
            setCupOrder(prev => [...prev].sort(() => Math.random() - 0.5));
        }, 300);

        setTimeout(() => {
            clearInterval(interval);
            setGameState('picking');
        }, 2000);
    };

    const handlePick = async (cupId) => {
        if (gameState !== 'picking') return;

        const data = await playCups(cupId); // assume API returns correct_cup
        if (data && !data.error) {
            setResult(data);
            setGameState('result');

            setTimeout(() => {
                setGameState('idle');
                setResult(null);
            }, 3000);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <h2 className="text-2xl font-display text-accent">Чаши Судьбы</h2>

            <div className="flex gap-4 min-h-[150px] items-end justify-center">
                <AnimatePresence>
                    {cupOrder.map((id) => (
                        <motion.div
                            layout
                            key={id}
                            onClick={() => handlePick(id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-20 h-24 bg-gradient-to-b from-amber-500 to-amber-700 rounded-b-xl rounded-t-sm flex items-center justify-center cursor-pointer shadow-lg relative ${gameState === 'picking' ? 'animate-bounce-slow' : ''}`}
                        >
                            <div className="absolute inset-x-0 -top-2 h-4 bg-amber-600 rounded-[100%] border border-amber-800" />

                            {gameState === 'result' && result?.correct_cup === id && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: -40 }}
                                    className="absolute -top-10 text-4xl"
                                >
                                    ✨
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {gameState === 'idle' && (
                <button
                    onClick={handlePlay}
                    disabled={energy < 1}
                    className="btn btn-primary"
                >
                    Играть (-1 ⚡)
                </button>
            )}

            {gameState === 'result' && (
                <div className="text-center animate-pulse">
                    {result.win ? (
                        <p className="text-green-400 font-bold">Победа! +{result.reward} Пыли</p>
                    ) : (
                        <p className="text-red-400">Пусто...</p>
                    )}
                </div>
            )}

            <p className="text-xs text-white/50">Угадай, где спрятан дар.</p>
        </div>
    );
}
