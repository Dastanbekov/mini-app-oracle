import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Eye, X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from '../TarotCard';

export default function GameFog() {
    const { playFog, balanceDust } = useGameStore();
    const [card, setCard] = useState(null);
    const canvasRef = useRef(null);
    const [isScratching, setIsScratching] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Scratch progress
    const [progress, setProgress] = useState(0);

    // Initialize Canvas when card is fetched
    useEffect(() => {
        if (!canvasRef.current || !card || revealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Draw cover image (Mystical Design with "A")
        // We'll create a nice gradient/pattern
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1e1b4b'); // indigo-950
        gradient.addColorStop(0.5, '#312e81'); // indigo-900
        gradient.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pattern
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 2;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        // Center "A" or Symbol
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.font = 'bold 80px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("?", canvas.width / 2, canvas.height / 2);

        ctx.font = 'italic 20px serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText("Сотри меня", canvas.width / 2, canvas.height / 2 + 50);

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';

    }, [card, revealed]);

    const handleStart = async () => {
        if (balanceDust < 100) return;
        setLoading(true);
        const data = await playFog(); // API call consumes dust and returns card
        setLoading(false);
        if (data && !data.error) {
            setCard(data);
            setRevealed(false);
            setProgress(0);
        }
    };

    const handleMouseMove = (e) => {
        if (!isScratching || revealed || !card) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Handle both mouse and touch
        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;

        if (!clientX || !clientY) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';

        // Scratch Brush
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Throttle check for performance (e.g., check every 10 events or simplify check)
        // For simplicity, we check periodically or here
        if (Math.random() > 0.8) checkReveal();
    };

    const checkReveal = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        // Sample pixels to determine percentage (every 20th pixel)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let clearCount = 0;
        const totalPixels = pixels.length / 4;
        const sampleRate = 20;

        for (let i = 0; i < totalPixels; i += sampleRate) {
            if (pixels[i * 4 + 3] === 0) { // Alpha channel is 0
                clearCount++;
            }
        }

        const percentage = clearCount / (totalPixels / sampleRate);
        setProgress(percentage);

        if (percentage > 0.4) { // 40% cleared
            setRevealed(true);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full py-10">
            <h2 className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 drop-shadow-sm">
                Туман Таро
            </h2>

            <div className="relative w-[260px] h-[420px] rounded-xl flex items-center justify-center">
                {/* 1. The Result Card (Hidden underneath) */}
                {card && (
                    <div className="absolute inset-0 z-0">
                        <TarotCard
                            cardData={card}
                            flipped={true}
                            onFlip={() => { }}
                            className="w-full h-full shadow-2xl rounded-xl"
                        />
                    </div>
                )}

                {/* 2. The Scratch Layer (Canvas) */}
                <AnimatePresence>
                    {!revealed && card && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.1, pointerEvents: 'none' }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 z-10 rounded-xl overflow-hidden shadow-2xl bg-[#1e1b4b]"
                        >
                            <canvas
                                ref={canvasRef}
                                width={260}
                                height={420}
                                className="w-full h-full touch-none cursor-crosshair"
                                onMouseDown={() => setIsScratching(true)}
                                onMouseUp={() => setIsScratching(false)}
                                onMouseLeave={() => setIsScratching(false)}
                                onMouseMove={handleMouseMove}
                                onTouchStart={() => setIsScratching(true)}
                                onTouchEnd={() => setIsScratching(false)}
                                onTouchMove={handleMouseMove}
                            />
                            {/* Instruction overlay - fades out on scratch */}
                            {progress < 0.05 && (
                                <div className="absolute bottom-10 w-full text-center pointer-events-none animate-pulse">
                                    <p className="text-white/50 text-xs uppercase tracking-widest">Потрите, чтобы открыть</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. Start State (Empty Placeholder) */}
                {!card && !loading && (
                    <div className="absolute inset-0 z-0 bg-white/5 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4">
                        <p className="text-blue-200/60 font-medium text-center px-4">
                            Карта судьбы скрыта под слоем реальности
                        </p>
                        <button
                            onClick={handleStart}
                            disabled={balanceDust < 100}
                            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all
                                ${balanceDust >= 100
                                    ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                            `}
                        >
                            {balanceDust >= 100 ? (
                                <>
                                    <Sparkles size={18} />
                                    Открыть (100 💎)
                                </>
                            ) : (
                                <>Не хватает пыли</>
                            )}
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-sm">
                        <Loader2 className="animate-spin text-blue-400" size={40} />
                    </div>
                )}

                {/* Close Button (Only when revealed) */}
                {revealed && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => { setCard(null); setRevealed(false); setProgress(0); }}
                        className="absolute -bottom-16 z-50 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        <X size={16} />
                        Закрыть
                    </motion.button>
                )}
            </div>

            {/* Helper Text */}
            {card && !revealed && (
                <p className="text-xs text-gray-500 animate-fade-in">
                    Стирайте защитный слой...
                </p>
            )}
        </div>
    );
}
