import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from '../TarotCard';

export default function GameFog() {
    const { playFog, balanceDust } = useGameStore();
    const [card, setCard] = useState(null);
    const canvasRef = useRef(null);
    const [isScratching, setIsScratching] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Initialize transparent Canvas when card is fetched
    useEffect(() => {
        if (!canvasRef.current || !card || revealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Make canvas fully opaque initially (fills cover layer)
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';

    }, [card, revealed]);

    const handleStart = async () => {
        if (balanceDust < 100) return;
        setLoading(true);
        const data = await playFog();
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

        const clientX = e.clientX || e.touches?.[0]?.clientX;
        const clientY = e.clientY || e.touches?.[0]?.clientY;

        if (!clientX || !clientY) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';

        // Scratch Brush
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() > 0.7) checkReveal();
    };

    const checkReveal = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let clearCount = 0;
        const totalPixels = pixels.length / 4;
        const sampleRate = 20;

        for (let i = 0; i < totalPixels; i += sampleRate) {
            if (pixels[i * 4 + 3] === 0) {
                clearCount++;
            }
        }

        const percentage = clearCount / (totalPixels / sampleRate);
        setProgress(percentage);

        if (percentage > 0.35) {
            setRevealed(true);
        }
    };

    // Golden Card Back Component (the scratchable layer visual)
    const GoldenCardBack = () => (
        <div className="absolute inset-0 h-full w-full rounded-xl border-2 border-[#996515] bg-[#151515] p-2 shadow-[0_0_15px_rgba(153,101,21,0.2)]">
            {/* Inner frame */}
            <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-[#996515]/30 bg-[#1a1a1c] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-[#1a1a1c] to-[#1a1a1c]">
                {/* "A" letter */}
                <div className="text-[100px] font-thin text-[#FDD017] drop-shadow-[0_2px_10px_rgba(153,101,21,0.5)] font-serif leading-none select-none opacity-90">
                    A
                </div>

                {/* Hint text */}
                {progress < 0.05 && (
                    <p className="absolute bottom-10 text-white/40 text-xs uppercase tracking-widest animate-pulse">
                        Сотрите, чтобы открыть
                    </p>
                )}
            </div>

            {/* Decorative corners */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#996515]" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#996515]" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#996515]" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#996515]" />
        </div>
    );

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

                {/* 2. The Golden Card Back (Visual Layer) + Canvas (Scratch Detection) */}
                <AnimatePresence>
                    {!revealed && card && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 z-10 rounded-xl overflow-hidden"
                        >
                            {/* Golden Back Visual */}
                            <GoldenCardBack />

                            {/* Invisible Canvas for scratch detection - uses mask */}
                            <canvas
                                ref={canvasRef}
                                width={260}
                                height={420}
                                className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
                                style={{
                                    mixBlendMode: 'destination-in',
                                    opacity: 1
                                }}
                                onMouseDown={() => setIsScratching(true)}
                                onMouseUp={() => setIsScratching(false)}
                                onMouseLeave={() => setIsScratching(false)}
                                onMouseMove={handleMouseMove}
                                onTouchStart={() => setIsScratching(true)}
                                onTouchEnd={() => setIsScratching(false)}
                                onTouchMove={handleMouseMove}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3. Start State (Golden Card Placeholder) */}
                {!card && !loading && (
                    <div className="absolute inset-0 z-0 rounded-xl flex flex-col items-center justify-center">
                        {/* Show golden back as preview */}
                        <div className="relative w-full h-full opacity-60">
                            <GoldenCardBack />
                        </div>

                        {/* Overlay button */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 rounded-xl">
                            <p className="text-blue-200/80 font-medium text-center px-4 text-sm">
                                Карта судьбы скрыта
                            </p>
                            <button
                                onClick={handleStart}
                                disabled={balanceDust < 100}
                                className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all
                                    ${balanceDust >= 100
                                        ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:brightness-110 text-white shadow-lg shadow-yellow-500/30'
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
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-xl backdrop-blur-sm">
                        <Loader2 className="animate-spin text-yellow-400" size={40} />
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

            {/* Progress indicator while scratching */}
            {card && !revealed && progress > 0.05 && (
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                    />
                </div>
            )}
        </div>
    );
}
