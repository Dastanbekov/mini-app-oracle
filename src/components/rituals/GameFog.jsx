import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TarotCard from '../TarotCard';

export default function GameFog({ onNoEnergy }) {
    const { playFog, balanceDust, energy } = useGameStore();
    const [card, setCard] = useState(null);
    const canvasRef = useRef(null);
    const [isScratching, setIsScratching] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Draw golden card back on canvas when card is fetched
    useEffect(() => {
        if (!canvasRef.current || !card || revealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Clear canvas first
        ctx.clearRect(0, 0, w, h);

        // === Draw Golden Card Back ===

        // 1. Main background - dark gray
        ctx.fillStyle = '#151515';
        ctx.fillRect(0, 0, w, h);

        // 2. Outer border - deep gold
        ctx.strokeStyle = '#996515';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, w - 4, h - 4);

        // 3. Inner frame area
        const padding = 16;
        ctx.fillStyle = '#1a1a1c';
        ctx.fillRect(padding, padding, w - padding * 2, h - padding * 2);

        // 4. Inner border
        ctx.strokeStyle = 'rgba(153, 101, 21, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(padding, padding, w - padding * 2, h - padding * 2);

        // 5. Radial gradient overlay
        const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        gradient.addColorStop(0, 'rgba(100, 100, 100, 0.15)');
        gradient.addColorStop(1, 'rgba(26, 26, 28, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(padding, padding, w - padding * 2, h - padding * 2);

        // 6. "A" Letter - bright gold
        ctx.fillStyle = '#FDD017';
        ctx.font = '160px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(153, 101, 21, 0.5)';
        ctx.shadowBlur = 15;
        ctx.fillText('A', w / 2, h / 2 - 10);
        ctx.shadowBlur = 0;

        // 7. Decorative corners
        const cornerSize = 16;
        const cornerOffset = 12;
        ctx.strokeStyle = '#996515';
        ctx.lineWidth = 1;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(cornerOffset, cornerOffset + cornerSize);
        ctx.lineTo(cornerOffset, cornerOffset);
        ctx.lineTo(cornerOffset + cornerSize, cornerOffset);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(w - cornerOffset - cornerSize, cornerOffset);
        ctx.lineTo(w - cornerOffset, cornerOffset);
        ctx.lineTo(w - cornerOffset, cornerOffset + cornerSize);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(cornerOffset, h - cornerOffset - cornerSize);
        ctx.lineTo(cornerOffset, h - cornerOffset);
        ctx.lineTo(cornerOffset + cornerSize, h - cornerOffset);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(w - cornerOffset - cornerSize, h - cornerOffset);
        ctx.lineTo(w - cornerOffset, h - cornerOffset);
        ctx.lineTo(w - cornerOffset, h - cornerOffset - cornerSize);
        ctx.stroke();

        // 8. Hint text at the bottom
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Сотрите, чтобы открыть', w / 2, h - 40);

        ctx.globalCompositeOperation = 'source-over';

    }, [card, revealed]);

    const handleStart = async () => {
        if (energy < 1) {
            if (onNoEnergy) onNoEnergy();
            return;
        }
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

        // Scale coordinates for canvas resolution
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';

        // Scratch Brush - larger for better UX
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
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

    // Golden Card Back Component for preview
    const GoldenCardBack = () => (
        <div className="absolute inset-0 h-full w-full rounded-xl border-2 border-[#996515] bg-[#151515] p-2 shadow-[0_0_15px_rgba(153,101,21,0.2)]">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-[#996515]/30 bg-[#1a1a1c] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-[#1a1a1c] to-[#1a1a1c]">
                <div className="text-[100px] font-thin text-[#FDD017] drop-shadow-[0_2px_10px_rgba(153,101,21,0.5)] font-serif leading-none select-none opacity-90">
                    A
                </div>
            </div>
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

                {/* 2. The Scratch Layer (Canvas with golden card drawn on it) */}
                <AnimatePresence>
                    {!revealed && card && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 z-10 rounded-xl overflow-hidden shadow-2xl"
                        >
                            <canvas
                                ref={canvasRef}
                                width={260}
                                height={420}
                                className="w-full h-full touch-none cursor-crosshair rounded-xl"
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
                        <div className="relative w-full h-full opacity-60">
                            <GoldenCardBack />
                        </div>

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
                        transition={{ delay: 1.2 }}
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

            {/* Revealed Card Description Panel */}
            <AnimatePresence>
                {revealed && card && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="w-full max-w-sm glass-card p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden"
                    >
                        {/* Sparkle particles */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="absolute inset-0 pointer-events-none"
                        >
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-yellow-400"
                                    initial={{
                                        opacity: 0,
                                        scale: 0,
                                        x: `${20 + i * 15}%`,
                                        y: `${10 + (i % 3) * 30}%`
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                        y: [`${10 + (i % 3) * 30}%`, `${-10 + (i % 3) * 20}%`]
                                    }}
                                    transition={{
                                        delay: 0.8 + i * 0.1,
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 2
                                    }}
                                >
                                    <Sparkles size={16} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-xs text-purple-400 uppercase tracking-widest mb-2"
                            >
                                Вам выпала карта
                            </motion.p>

                            <motion.h3
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                                className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 mb-4"
                            >
                                {card.name}
                            </motion.h3>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-4"
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="text-sm text-gray-300 leading-relaxed"
                            >
                                {card.desc}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
