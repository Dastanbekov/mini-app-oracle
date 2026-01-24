import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import TaroCoinImage from '../assets/taro_coin.png';

export default function TaroCoin() {
    const navigate = useNavigate();
    const { balanceTarotCoins } = useGameStore();
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const coinRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!coinRef.current) return;
        const rect = coinRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateY = (e.clientX - centerX) / 10;
        const rotateX = -(e.clientY - centerY) / 10;
        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div className="flex flex-col gap-6 pb-20 min-h-[80vh] px-2">
            <header className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-white/5 active:bg-white/10"
                >
                    <ArrowLeft className="text-white" size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                        Azalea Oracle Taro Coin
                    </h1>
                    <p className="text-sm text-gray-400">
                        Премиальная валюта экосистемы
                    </p>
                </div>
            </header>

            {/* 3D Coin Display */}
            <div
                ref={coinRef}
                className="relative flex justify-center items-center py-8"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <motion.div
                    animate={{
                        rotateX: rotation.x,
                        rotateY: rotation.y,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    className="relative"
                    style={{ perspective: 1000 }}
                >
                    <motion.img
                        src={TaroCoinImage}
                        alt="Azalea Oracle Taro Coin"
                        className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                        animate={{
                            rotateY: [0, 360],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        whileHover={{
                            scale: 1.1,
                            transition: { duration: 0.3 }
                        }}
                    />
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full -z-10" />
                </motion.div>
            </div>

            {/* Balance */}
            <div className="glass-card p-6 rounded-2xl border border-yellow-500/30 text-center">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Ваш баланс</p>
                <h2 className="text-4xl font-display font-bold text-yellow-400">
                    {balanceTarotCoins?.toFixed(2) || '0.00'} <span className="text-xl">TC</span>
                </h2>
            </div>

            {/* Info Sections */}
            <div className="space-y-4">
                <div className="glass-card p-4 rounded-2xl border border-white/10">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Что такое Taro Coin?</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Taro Coin (TC) — это уникальная премиальная валюта в экосистеме Azalea Oracle.
                                Вы можете заработать её, обменяв Цветы 🌸, полученные в играх.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/10">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Листинг на бирже</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Мы планируем листинг Taro Coin на криптобирже в ближайшем будущем.
                                Копите монеты сейчас, чтобы быть готовыми к торгам!
                            </p>
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                <span className="text-green-400 text-xs font-medium">Скоро</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/10">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Как использовать сейчас?</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Пока листинг не состоялся, вы можете обменять Taro Coin на:
                            </p>
                            <ul className="mt-2 text-sm text-gray-300 space-y-1">
                                <li>• Консультации таролога — 5 TC</li>
                                <li>• Персональные расклады — 3 TC</li>
                                <li>• Эксклюзивные функции (скоро)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-4">
                <p className="text-xs text-gray-500 mb-4">
                    Следите за новостями в нашем Telegram-канале
                </p>
                <a
                    href="https://t.me/AzaleaOracle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold shadow-lg hover:brightness-110 transition-all"
                >
                    <ExternalLink size={18} />
                    Telegram @AzaleaOracle
                </a>
            </div>
        </div>
    );
}
