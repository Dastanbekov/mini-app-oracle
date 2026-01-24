import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Sparkles, Flower2 } from 'lucide-react';
import CupImage from '../../assets/cup.png';

// Using SVG paths for a more "Mystical Cup" look instead of simple div
const CupIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
        <path d="M5 3h14c0 .6-.1 1.2-.2 1.8L17 13a5 5 0 0 1-10 0L5 4.8A9 9 0 0 1 5 3z" className="fill-amber-900/50 stroke-amber-500" />
        <path d="M8 21h8" className="stroke-amber-400" />
        <path d="M12 13v8" className="stroke-amber-400" />
    </svg>
);

export default function GameCups() {
    const { playCups, balanceDust, energy } = useGameStore();
    const [gameState, setGameState] = useState('idle');
    const [result, setResult] = useState(null);
    const [cups, setCups] = useState([0, 1, 2]);

    const handlePlay = async () => {
        if (energy < 1) return;
        setGameState('shuffling');
        setResult(null);

        // Advanced Shuffle Animation
        let moves = 0;
        const maxMoves = 10;
        const interval = setInterval(() => {
            setCups(prev => {
                const newOrder = [...prev];
                // Swap two random cups
                const idx1 = Math.floor(Math.random() * 3);
                const idx2 = (idx1 + 1) % 3;
                [newOrder[idx1], newOrder[idx2]] = [newOrder[idx2], newOrder[idx1]];
                return newOrder;
            });
            moves++;
            if (moves >= maxMoves) {
                clearInterval(interval);
                setGameState('picking');
            }
        }, 300);
    };

    const handlePick = async (index) => {
        if (gameState !== 'picking') return;

        // Map visual index to backend ID (simplified as 1,2,3)
        // Since backend logic is simple random, the ID sent matters less than the result logic
        const cupId = cups[index] + 1;

        const data = await playCups(cupId);
        if (data && !data.error) {
            setResult(data);
            setGameState('result');

            setTimeout(() => {
                setGameState('idle');
            }, 4000);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full py-10">
            <h2 className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 drop-shadow-sm">
                Чаши Судьбы
            </h2>

            <div className="relative h-48 w-full max-w-sm flex items-end justify-around px-4">
                <AnimatePresence>
                    {cups.map((id, index) => (
                        <motion.div
                            layout
                            key={id}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={() => handlePick(index)}
                            className={`relative cursor-pointer group w-24 h-32 flex flex-col items-center justify-end
                                ${gameState === 'picking' ? "hover:-translate-y-2" : ""}
                            `}
                        >
                            {/* Mystical Glow */}
                            <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/20 blur-xl rounded-full transition-all duration-500" />

                            <motion.div
                                animate={gameState === 'picking' ? {
                                    y: [0, -5, 0],
                                    rotate: [0, 2, -2, 0]
                                } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-24 h-24 flex items-center justify-center"
                            >
                                <img
                                    src={CupImage}
                                    alt="Mystical Cup"
                                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
                                />
                            </motion.div>

                            {/* Result Reveal */}
                            <AnimatePresence>
                                {gameState === 'result' && result?.correct_cup === (id + 1) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, y: 0 }}
                                        animate={{ opacity: 1, scale: 1, y: -50 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute top-0 z-20"
                                    >
                                        <Flower2 className="w-12 h-12 text-pink-300 fill-pink-300 animate-spin-slow drop-shadow-lg" />
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.5 }}
                                            className="absolute inset-0 bg-yellow-400 blur-lg -z-10 opacity-50"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="h-16 flex items-center justify-center w-full">
                {gameState === 'idle' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePlay}
                        disabled={energy < 1}
                        className="btn btn-primary bg-gradient-to-r from-amber-600 to-amber-800 border-none shadow-[0_0_20px_rgba(245,158,11,0.4)] text-lg px-8 py-3 rounded-full flex items-center gap-2"
                    >
                        <Sparkles size={20} /> Играть (-1 ⚡)
                    </motion.button>
                )}

                {gameState === 'shuffling' && (
                    <p className="text-amber-200 animate-pulse text-lg tracking-widest uppercase">Перемешиваю...</p>
                )}

                {gameState === 'picking' && (
                    <p className="text-white font-medium drop-shadow-md">Выбери свою судьбу... (-1 ⚡)</p>
                )}

                {gameState === 'result' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        {result.win ? (
                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-bold text-green-400 drop-shadow-md">Победа!</p>
                                <div className="flex gap-4">
                                    <p className="text-amber-300 font-bold">+{result.reward_dust || 50} Пыли</p>
                                    <p className="text-pink-300 font-bold">+{result.reward_flowers || 50} Цветов</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <p className="text-red-400 font-bold text-xl drop-shadow-md">Пусто...</p>
                                {result.reward_flowers > 0 && (
                                    <p className="text-pink-300 font-bold text-sm opacity-80">Но вы нашли {result.reward_flowers} Цветов!</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <p className="text-xs text-white/30 text-center max-w-xs">Испытай удачу. Чаши перемешиваются магическим образом. Следи внимательно.</p>
        </div>
    );
}
