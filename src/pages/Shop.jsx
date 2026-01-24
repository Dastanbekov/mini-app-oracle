import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap, Gem, ArrowLeft, Loader2, RefreshCw, Coins, Info } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import TaroCoinImage from '../assets/taro_coin.png';

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
        name: 'Горсть Пыльцы',
        description: 'Немного магии для начала',
        price: '29 ₽',
        icon: Gem,
        color: 'from-amber-400 to-orange-500',
        reward: '100 🌸'
    },
    {
        id: 'dust_pack_500',
        name: 'Мешочек Пыльцы',
        description: 'Хватит на 5 открытий Тумана',
        price: '99 ₽',
        icon: Gem,
        color: 'from-purple-500 to-pink-500',
        reward: '500 🌸'
    },
    {
        id: 'dust_pack_1500',
        name: 'Сундук Пыльцы',
        description: '1500 + 300 бонусом! Выгодно',
        price: '199 ₽',
        icon: Gem,
        color: 'from-emerald-400 to-green-600',
        reward: '1800 🌸'
    }
];

// Services that can be bought with Taro Coin
const SERVICES = [
    { name: 'Консультация Таролога', price: 5, description: 'Личная консультация 30 мин' },
    { name: 'Расклад на Любовь', price: 3, description: 'Подробный расклад на отношения' },
    { name: 'Расклад на Карьеру', price: 3, description: 'Прогноз на профессиональную сферу' },
];

export default function Shop() {
    const navigate = useNavigate();
    const location = useLocation();
    const { createPayment, openPaymentUrl, paymentLoading, balanceFlowers, balanceTarotCoins, exchangeFlowers } = useGameStore();
    const [processingId, setProcessingId] = useState(null);
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'shop');
    const [exchangeAmount, setExchangeAmount] = useState('');
    const [exchangeLoading, setExchangeLoading] = useState(false);

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

    const handleExchange = async () => {
        const amount = parseInt(exchangeAmount);
        if (!amount || amount < 1000) {
            alert('Минимальная сумма обмена: 1000 цветов');
            return;
        }
        if (amount > balanceFlowers) {
            alert('Недостаточно цветов');
            return;
        }

        setExchangeLoading(true);
        const res = await exchangeFlowers(amount);
        setExchangeLoading(false);

        if (res.error) {
            alert(res.error);
        } else {
            alert(`Успешно! Получено ${res.received} TC`);
            setExchangeAmount('');
        }
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
                        {activeTab === 'shop' ? 'Пополни запасы магии' : 'Обмен ресурсов'}
                    </p>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white/5 rounded-xl p-1 flex w-full mb-2">
                <button
                    onClick={() => setActiveTab('shop')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'shop' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <ShoppingBag size={16} className="inline mr-2" />
                    Покупки
                </button>
                <button
                    onClick={() => setActiveTab('exchange')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'exchange' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <RefreshCw size={16} className="inline mr-2" />
                    Обмен
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'shop' ? (
                    <motion.div
                        key="shop"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {PRODUCTS.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass-card p-4 rounded-2xl border border-white/10 relative overflow-hidden group"
                            >
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
                    </motion.div>
                ) : (
                    <motion.div
                        key="exchange"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Balance Info */}
                        <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-black/40">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase tracking-widest">Баланс Цветов</p>
                                    <h2 className="text-3xl font-display font-bold text-pink-400">{balanceFlowers} 🌸</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs uppercase tracking-widest">Taro Coin</p>
                                    <h2 className="text-3xl font-display font-bold text-yellow-400">{balanceTarotCoins?.toFixed(2)} TC</h2>
                                </div>
                            </div>

                            <hr className="border-white/10 mb-6" />

                            <div className="space-y-4">
                                <label className="text-sm text-gray-300">Сколько цветов обменять?</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={exchangeAmount}
                                        onChange={(e) => setExchangeAmount(e.target.value)}
                                        placeholder="Мин. 1000"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                                    />
                                    <button
                                        onClick={() => setExchangeAmount(Math.floor(balanceFlowers))}
                                        className="bg-white/10 hover:bg-white/20 px-4 rounded-lg text-sm font-bold text-amber-200"
                                    >
                                        MAX
                                    </button>
                                </div>

                                <div className="flex justify-between text-xs text-gray-500 px-2">
                                    <span>Вам придет:</span>
                                    <span className="text-yellow-400 font-bold">
                                        {exchangeAmount ? (parseInt(exchangeAmount) * 0.0005).toFixed(3) : '0.00'} TC
                                    </span>
                                </div>
                                <p className="text-xs text-center text-gray-500">Курс: 1000 🌸 = 0.5 TC</p>

                                <button
                                    onClick={handleExchange}
                                    disabled={exchangeLoading || !exchangeAmount || parseInt(exchangeAmount) < 1000}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold text-lg shadow-lg shadow-amber-900/40 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {exchangeLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                                    Обменять на Taro Coin
                                </button>
                            </div>
                        </div>

                        {/* Services Pricing */}
                        <div className="glass-card p-4 rounded-2xl border border-purple-500/20">
                            <h3 className="font-bold text-purple-200 text-lg mb-4 flex items-center gap-2">
                                <Coins size={20} className="text-purple-400" />
                                Услуги за Taro Coin
                            </h3>
                            <div className="space-y-3">
                                {SERVICES.map((service, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                        <div>
                                            <p className="font-medium text-white">{service.name}</p>
                                            <p className="text-xs text-gray-400">{service.description}</p>
                                        </div>
                                        <span className="font-bold text-yellow-400">{service.price} TC</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-4">Для заказа услуги свяжитесь с @AzaleaOracle</p>
                        </div>

                        {/* Taro Coin Info Link */}
                        <Link to="/taro-coin" className="glass-card p-4 rounded-2xl border border-yellow-500/20 bg-yellow-900/10 flex items-center gap-4 hover:bg-yellow-900/20 transition-colors">
                            <img src={TaroCoinImage} alt="Taro Coin" className="w-16 h-16 object-contain" />
                            <div className="flex-1">
                                <h3 className="font-bold text-yellow-200 text-lg mb-1">Azalea Oracle Taro Coin</h3>
                                <p className="text-sm text-yellow-100/70">
                                    Узнай больше о монете и её будущем листинге →
                                </p>
                            </div>
                            <Info size={20} className="text-yellow-400" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
