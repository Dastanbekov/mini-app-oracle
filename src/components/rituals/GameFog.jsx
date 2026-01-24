import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Eye, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from '../TarotCard';

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

            <div className="relative w-[260px] h-[420px] [perspective:1000px] flex items-center justify-center">
                {/* 1. The Card - Always Rendered */}
                <TarotCard
                    cardData={card || { name: 'Unknown', image: '' }}
                    flipped={!!card} // Flip when card data is present
                    onFlip={() => { }}
                    className="absolute inset-0 z-0 shadow-2xl rounded-xl"
                />

                {/* 2. The Fog Layer (Canvas) */}
                <AnimatePresence>
                    {!card && (
                        <motion.div
                            key="fog-layer"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.8 } }}
                            className="absolute inset-0 z-10 rounded-xl overflow-hidden touch-none"
                        >
                            <canvas
                                ref={canvasRef}
                                width={260}
                                height={420}
                                className="w-full h-full cursor-crosshair"
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
                                <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none animate-bounce-slow z-20">
                                    <p className="text-xs text-amber-200/80 uppercase tracking-widest drop-shadow-md">Проведи пальцем</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. Close Button (Only when revealed) */}
                {card && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => { setCard(null); setRevealed(false); setIsScratching(false); }}
                        className="absolute -top-4 -right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-[#996515] hover:text-white transition-all shadow-lg border border-[#996515]/30"
                    >
                        <X size={20} />
                    </motion.button>
                )}
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
