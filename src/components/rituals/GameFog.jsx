import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameFog() {
    const { playFog, balanceDust } = useGameStore();
    const [card, setCard] = useState(null);
    const canvasRef = useRef(null);
    const [isScratching, setIsScratching] = useState(false);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (!canvasRef.current || card) return; // Only init scratch if no card shown yet (or reset)

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Fill grey
        ctx.fillStyle = '#94a3b8'; // slate-400
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add "Fog" text
        ctx.fillStyle = '#475569';
        ctx.font = '20px serif';
        ctx.fillText("Туман...", 50, 100);

    }, [revealed]); // simplified

    const handleMouseMove = (e) => {
        if (!isScratching || revealed || card) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        checkReveal();
    };

    const checkReveal = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clear = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) clear++;
        }

        if (clear / (imageData.data.length / 4) > 0.4) {
            setRevealed(true);
            doPull();
        }
    };

    const doPull = async () => {
        const data = await playFog();
        if (data && !data.error) {
            setCard(data);
        } else {
            // Handle error (e.g. no dust)
            // For now just reset
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <h2 className="text-2xl font-display text-accent">Туман Таро</h2>

            {!card ? (
                <div className="relative w-48 h-72 bg-gray-800 rounded-xl overflow-hidden border border-white/10 shadow-xl">
                    <canvas
                        ref={canvasRef}
                        width={192}
                        height={288}
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
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                        {balanceDust < 100 ? "Не хватает пыли (100)" : "Сотри меня"}
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    className="relative w-64 h-96 [perspective:1000px]"
                >
                    <div className="w-full h-full glass-card rounded-xl p-2 flex flex-col items-center gap-2">
                        <img src={card.image} alt={card.name} className="w-full h-4/5 object-cover rounded-lg" />
                        <h3 className="text-xl font-bold">{card.name}</h3>
                        <span className={`badge ${card.rarity === 'gold' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                            {card.rarity}
                        </span>
                        <button onClick={() => { setCard(null); setRevealed(false); }} className="btn btn-sm btn-ghost">
                            <X size={16} /> Закрыть
                        </button>
                    </div>
                </motion.div>
            )}

            {!card && (
                <div className="text-center">
                    <p className="text-sm text-gray-400">Сотри туман, чтобы найти карту.</p>
                    <p className="text-primary font-bold">Цена: 100 Пыли</p>
                </div>
            )}
        </div>
    );
}
