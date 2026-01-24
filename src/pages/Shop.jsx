import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { ShoppingBag, Zap, Gem, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRODUCTS = [
    {
        id: 'energy_refill',
        name: 'Полная Энергия',
        description: 'Восстанови 5/5 энергии моментально',
        price: '19 ₽',
        icon: Zap,
        color: 'from-blue-500 to-cyan-400',
        reward: '5 ⚡'
    },
    {
        id: 'dust_pack_100',
        name: 'Горсть Пыли',
        description: 'Немного магии для начала',
        price: '29 ₽',
        icon: Gem,
        color: 'from-amber-400 to-orange-500',
        reward: '100 💎'
    },
    {
        id: 'dust_pack_500',
        name: 'Мешочек Пыли',
        description: 'Хватит на 5 открытий Тумана',
        price: '99 ₽',
        icon: Gem,
        color: 'from-purple-500 to-pink-500',
        reward: '500 💎'
    },
    {
        id: 'dust_pack_1500',
        name: 'Сундук Пыли',
        description: '1500 + 300 бонусом! Выгодно',
        price: '199 ₽',
        icon: Gem,
        color: 'from-emerald-400 to-green-600',
        reward: '1800 💎'
    }
];

export default function Shop() {
    const navigate = useNavigate();
    const { createPayment, openPaymentUrl, paymentLoading } = useGameStore();
    const [processingId, setProcessingId] = useState(null);

    const handleBuy = async (product) => {
        if (processingId) return;
        setProcessingId(product.id);

        const res = await createPayment(product.id);

        if (res.success && res.confirmation_url) {
            openPaymentUrl(res.confirmation_url);
        } else {
            alert('Ошибка создания платежа');
        }
        setProcessingId(null);
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
                    <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">
                        Магазин
                    </h1>
                    <p className="text-sm text-gray-400">
                        Пополни запасы магии
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {PRODUCTS.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-4 rounded-2xl border border-white/10 relative overflow-hidden group"
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${product.color} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`} />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${product.color} shadow-lg shadow-black/20`}>
                                <product.icon className="text-white" size={28} />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">{product.name}</h3>
                                <div className="text-xs text-white/60 mb-1">{product.description}</div>
                                <div className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${product.color}`}>
                                    {product.reward}
                                </div>
                            </div>

                            <button
                                onClick={() => handleBuy(product)}
                                disabled={processingId !== null}
                                className={`px-4 py-2 rounded-lg font-bold text-white shadow-lg transition-all active:scale-95 flex items-center gap-2
                                    ${processingId === product.id ? 'bg-gray-600' : `bg-gradient-to-r ${product.color} hover:brightness-110`}
                                `}
                            >
                                {processingId === product.id ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    product.price
                                )}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
                Оплата происходит через YooKassa (безопасно)
            </div>
        </div>
    );
}
