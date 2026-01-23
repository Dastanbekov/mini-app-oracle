import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Coins, Baby, User, Lock, CreditCard, CheckCircle, Loader, ExternalLink } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export default function Numerology() {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [error, setError] = useState(null);

    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');

    const { createPayment, openPaymentUrl, checkPaymentStatus, paymentLoading } = useGameStore();

    const tabs = [
        { id: 'general', label: 'Общая', icon: User },
        { id: 'compatibility', label: 'Совместимость', icon: Users },
        { id: 'financial', label: 'Финансовая', icon: Coins },
        { id: 'children', label: 'Детская', icon: Baby },
    ];

    const calculate = (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        setTimeout(() => {
            setLoading(false);
            setResult({ tab: activeTab, date1, date2, arcana: Math.floor(Math.random() * 22) + 1 });
        }, 1500);
    };

    const reset = () => {
        setResult(null);
        setDate1('');
        setDate2('');
        setIsPaid(false);
        setPaymentUrl(null);
        setPaymentId(null);
    };

    const handlePayment = async () => {
        setError(null);
        const result = await createPayment('numerology_reading');

        if (result.error) {
            if (result.code === 'NOT_CONFIGURED') {
                setIsPaid(true);
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
            } else {
                setError(result.error);
            }
            return;
        }

        if (result.confirmation_url) {
            setPaymentId(result.payment_id);
            setPaymentUrl(result.confirmation_url);
        }
    };

    const handleCheckPayment = async () => {
        if (!paymentId) return;

        const checkResult = await checkPaymentStatus(paymentId);
        if (checkResult.status === 'succeeded') {
            setIsPaid(true);
            setPaymentUrl(null);
            setPaymentId(null);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else if (checkResult.status === 'pending') {
            setError('Оплата ещё не завершена');
        }
    };

    return (
        <div className="flex flex-col gap-6 pb-20">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-accent drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    Матрица Судьбы
                </h2>
                <p className="text-xs text-center text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                    22 Аркана. Полная карта вашей жизни.
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-black/40 rounded-xl border border-gray-800 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setResult(null); setIsPaid(false); }}
                        className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-all text-[10px] font-medium ${activeTab === tab.id
                            ? 'bg-accent/10 text-accent ring-1 ring-accent/30'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={calculate}
                        className="glass-card p-6 rounded-2xl space-y-5 border border-accent/10"
                    >
                        <h3 className="text-lg text-white font-medium flex items-center gap-2">
                            {tabs.find(t => t.id === activeTab).label} матрица
                        </h3>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">
                                {activeTab === 'compatibility' ? 'Ваша дата рождения' : 'Дата рождения'}
                            </label>
                            <input
                                required
                                type="date"
                                value={date1}
                                onChange={(e) => setDate1(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-4 text-white focus:outline-none focus:border-accent transition-colors appearance-none min-h-[46px]"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>

                        {activeTab === 'compatibility' && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">
                                    Дата рождения партнера
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={date2}
                                    onChange={(e) => setDate2(e.target.value)}
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 pl-4 text-white focus:outline-none focus:border-accent transition-colors appearance-none min-h-[46px]"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-black font-bold py-4 rounded-xl mt-4 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    ❄️
                                </motion.div>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Рассчитать
                                </>
                            )}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Result Card */}
                        <div className="glass-card p-6 rounded-2xl border border-accent/20 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                {(() => {
                                    const Icon = tabs.find(t => t.id === activeTab).icon;
                                    return <Icon size={100} />;
                                })()}
                            </div>

                            <div className="relative z-10">
                                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Ваш Аркан</div>
                                <div className="text-5xl font-bold font-display text-white mb-2 text-glow">
                                    {result.arcana}
                                </div>
                                <div className="text-accent font-medium mb-4">
                                    {activeTab === 'general' && "Энергия Личности"}
                                    {activeTab === 'compatibility' && "Энергия Пары"}
                                    {activeTab === 'financial' && "Денежный Поток"}
                                    {activeTab === 'children' && "Детско-родительская карма"}
                                </div>

                                <div className="h-px bg-white/10 w-full my-4" />

                                {/* Free Preview */}
                                <p className="text-sm text-gray-300 leading-relaxed text-left">
                                    {activeTab === 'general' && "Вы обладаете сильной интуицией и способностью видеть скрытые смыслы. Ваша задача — научиться доверять себе."}
                                    {activeTab === 'compatibility' && "Ваш союз обладает потенциалом для духовного роста. Вы вместе, чтобы научить друг друга терпению."}
                                    {activeTab === 'financial' && "Деньги приходят к вам через передачу знаний и коммуникацию. Избегайте изолированности."}
                                    {activeTab === 'children' && "Ваш ребенок — ваш учитель. Не давите на него авторитетом, дайте свободу самовыражения."}
                                </p>
                            </div>
                        </div>

                        {/* Paywall */}
                        {!isPaid ? (
                            <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Lock size={20} className="text-amber-400" />
                                    <div>
                                        <h3 className="font-bold text-white">Полная расшифровка</h3>
                                        <p className="text-xs text-gray-400">Деньги, любовь, карьера, кармические задачи</p>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-400 text-xs">⚠️ {error}</p>
                                )}

                                {paymentUrl ? (
                                    <>
                                        <button
                                            onClick={() => openPaymentUrl(paymentUrl)}
                                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink size={18} />
                                            Перейти к оплате (49₽)
                                        </button>
                                        <button
                                            onClick={handleCheckPayment}
                                            disabled={paymentLoading}
                                            className="w-full py-2 text-sm text-accent hover:text-white transition-colors"
                                        >
                                            {paymentLoading ? <Loader size={16} className="animate-spin mx-auto" /> : "🔄 Проверить оплату"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handlePayment}
                                        disabled={paymentLoading}
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {paymentLoading ? (
                                            <Loader size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <CreditCard size={18} />
                                                Получить за 49₽
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-xl"
                            >
                                <CheckCircle size={18} />
                                <span className="font-medium text-sm">Полный разбор отправлен в бота!</span>
                            </motion.div>
                        )}

                        <button
                            onClick={reset}
                            className="w-full py-4 text-gray-400 hover:text-white transition-colors"
                        >
                            ← Вернуться к расчету
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
