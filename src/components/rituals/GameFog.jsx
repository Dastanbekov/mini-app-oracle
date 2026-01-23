import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Eye, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameFog() {
    const { playFog, balanceDust } = useGameStore();
    const [card, setCard] = useState(null);
    const canvasRef = useRef(null);
    const [isScratching, setIsScratching] = useState(false);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (!canvasRef.current || card) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Advanced Fog Texture
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#334155'); // slate-700
        gradient.addColorStop(1, '#0f172a'); // slate-900
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add "Fog" noise/text
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = 'italic 24px serif';
        ctx.textAlign = 'center';
        ctx.fillText("Туман Судьбы", canvas.width / 2, canvas.height / 2);

    }, [revealed, card]);

    const handleMouseMove = (e) => {
        if (!isScratching || revealed || card) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';

        // Create a soft brush
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        checkReveal();
    };

    const checkReveal = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clear = 0;
        // Optimization: check every 16th pixel
        for (let i = 3; i < imageData.data.length; i += 64) {
            if (imageData.data[i] === 0) clear++;
        }

        if (clear / (imageData.data.length / 64) > 0.35) {
            setRevealed(true);
            doPull();
        }
    };

    const doPull = async () => {
        const data = await playFog();
        if (data && !data.error) {
            setCard(data);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full py-10">
            <h2 className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 drop-shadow-sm">
                Туман Таро
            </h2>

            <div className="relative w-64 h-96 [perspective:1000px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {!card ? (
                        <motion.div
                            key="fog"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 group"
                        >
                            {/* Background Hint (Blurred) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black -z-10 opacity-50 flex items-center justify-center">
                                <span className="text-6xl opacity-20 filter blur-sm">?</span>
                            </div>

                            <canvas
                                ref={canvasRef}
                                width={256}
                                height={384}
                                className="absolute inset-0 z-10 cursor-crosshair touch-none"
                                onMouseDown={() => { if (balanceDust >= 100) setIsScratching(true); }}
                                onMouseUp={() => setIsScratching(false)}
                                onMouseMove={handleMouseMove}
                                onTouchStart={() => { if (balanceDust >= 100) setIsScratching(true); }}
                                onTouchEnd={() => setIsScratching(false)}
                                onTouchMove={(e) => {
                                    const touch = e.touches[0];
                                    handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
                                }}
                            />

                            {!isScratching && (
                                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none animate-bounce-slow">
                                    <p className="text-xs text-blue-200/50 uppercase tracking-widest">Проведи пальцем</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="card"
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="w-full h-full"
                        >
                            <div className="w-full h-full relative group">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/60 rounded-xl pointer-events-none" />
                                <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-xl border border-white/20 shadow-2xl" />

                                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent rounded-b-xl">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-xl font-bold text-white font-display">{card.name}</h3>
                                        {card.rarity === 'gold' && <Sparkles className="text-yellow-400 fill-yellow-400" size={20} />}
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${card.rarity === 'gold' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                        {card.rarity}
                                    </span>
                                </div>

                                <button
                                    onClick={() => { setCard(null); setRevealed(false); }}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-black/60 hover:text-white transition-all shadow-lg"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!card && (
                <div className="text-center">
                    <p className="text-blue-200/60 font-medium">Сотри туман, чтобы найти карту</p>
                    <div className="mt-2 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <span className="text-blue-300 font-bold">100 Пыли</span>
                    </div>
                </div>
            )}
        </div>
    );
}
