import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { User, Coins, Zap, Flower2, CreditCard, Layers, Copy, Check } from 'lucide-react';
import TaroCoinIcon from '../assets/taro_coin.png';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function Profile() {
    const { userId, balanceDust, balanceFlowers, balanceTarotCoins, energy, maxEnergy, syncUser } = useGameStore();
    const [cardsCollected, setCardsCollected] = useState(0);
    const [totalCards, setTotalCards] = useState(78);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        syncUser();
        // Fetch inventory to get cards count
        fetch(`${API_URL}/inventory?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCardsCollected(data.filter(c => c.owned).length);
                    setTotalCards(data.length);
                }
            })
            .catch(console.error);
    }, [userId, syncUser]);

    const copyId = () => {
        navigator.clipboard.writeText(String(userId));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const stats = [
        {
            label: 'Пыльца',
            value: balanceDust || 0,
            icon: <span className="text-lg">💎</span>,
            color: 'text-blue-400'
        },
        {
            label: 'Цветы',
            value: balanceFlowers || 0,
            icon: <Flower2 size={18} className="text-pink-400" />,
            color: 'text-pink-400'
        },
        {
            label: 'Энергия',
            value: `${energy || 0} / ${maxEnergy || 5}`,
            icon: <Zap size={18} className="text-green-400" />,
            color: 'text-green-400'
        },
        {
            label: 'Taro Coin',
            value: balanceTarotCoins?.toFixed(2) || '0.00',
            icon: <img src={TaroCoinIcon} alt="TC" className="w-5 h-5" />,
            color: 'text-yellow-400'
        },
    ];

    return (
        <div className="flex flex-col gap-6 pb-20 min-h-[80vh]">
            {/* Header */}
            <header className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
                >
                    <User size={40} className="text-white" />
                </motion.div>
                <h1 className="text-2xl font-display font-bold text-white mb-1">
                    Мой Профиль
                </h1>
                <p className="text-sm text-gray-400">
                    Azalea Oracle
                </p>
            </header>

            {/* User ID Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4 rounded-2xl border border-white/10"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">ID пользователя</p>
                        <p className="text-xl font-mono font-bold text-white">{userId}</p>
                    </div>
                    <button
                        onClick={copyId}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        {copied ? (
                            <Check size={20} className="text-green-400" />
                        ) : (
                            <Copy size={20} className="text-gray-400" />
                        )}
                    </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                    Используйте этот ID для переводов и связи с поддержкой
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="glass-card p-4 rounded-xl border border-white/10"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {stat.icon}
                            <span className="text-xs text-gray-400">{stat.label}</span>
                        </div>
                        <p className={`text-xl font-bold ${stat.color}`}>
                            {stat.value}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Collection Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-4 rounded-2xl border border-white/10"
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-purple-500/20">
                        <Layers size={20} className="text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Коллекция карт</p>
                        <p className="text-xs text-gray-400">{cardsCollected} из {totalCards} собрано</p>
                    </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cardsCollected / totalCards) * 100}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">
                    {Math.round((cardsCollected / totalCards) * 100)}% завершено
                </p>
            </motion.div>

            {/* Info */}
            <div className="text-center text-xs text-gray-500 mt-4">
                <p>Скоро: переводы Taro Coin между пользователями</p>
            </div>
        </div>
    );
}
