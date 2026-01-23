import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, CheckCircle, Loader, ExternalLink } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const SIGNS = [
    { name: "Овен", date: "21.03 - 19.04", icon: "♈", preview: "Огненная энергия, лидерство, первопроходец..." },
    { name: "Телец", date: "20.04 - 20.05", icon: "♉", preview: "Стабильность, упорство, материальный мир..." },
    { name: "Близнецы", date: "21.05 - 20.06", icon: "♊", preview: "Коммуникация, любознательность, двойственность..." },
    { name: "Рак", date: "21.06 - 22.07", icon: "♋", preview: "Эмоции, семья, интуиция..." },
    { name: "Лев", date: "23.07 - 22.08", icon: "♌", preview: "Творчество, харизма, щедрость..." },
    { name: "Дева", date: "23.08 - 22.09", icon: "♍", preview: "Аналитика, служение, перфекционизм..." },
    { name: "Весы", date: "23.09 - 22.10", icon: "♎", preview: "Гармония, партнёрство, красота..." },
    { name: "Скорпион", date: "23.10 - 21.11", icon: "♏", preview: "Трансформация, страсть, глубина..." },
    { name: "Стрелец", date: "22.11 - 21.12", icon: "♐", preview: "Свобода, философия, путешествия..." },
    { name: "Козерог", date: "22.12 - 19.01", icon: "♑", preview: "Амбиции, дисциплина, статус..." },
    { name: "Водолей", date: "20.01 - 18.02", icon: "♒", preview: "Инновации, независимость, гуманизм..." },
    { name: "Рыбы", date: "19.02 - 20.03", icon: "♓", preview: "Интуиция, сострадание, творчество..." }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Astrology() {
    const [selectedSign, setSelectedSign] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [error, setError] = useState(null);

    const { createPayment, openPaymentUrl, checkPaymentStatus, paymentLoading } = useGameStore();

    const handleSignClick = (sign) => {
        setSelectedSign(sign);
        setIsPaid(false);
        setPaymentUrl(null);
        setPaymentId(null);
        setError(null);
    };

    const handlePayment = async () => {
        setError(null);
        const result = await createPayment('astrology_reading');

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

        const result = await checkPaymentStatus(paymentId);
        if (result.status === 'succeeded') {
            setIsPaid(true);
            setPaymentUrl(null);
            setPaymentId(null);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else if (result.status === 'pending') {
            setError('Оплата ещё не завершена');
        }
    };

    return (
        <div className="pb-8">
            <h2 className="text-3xl font-serif text-center mb-2 bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent">Звёздный Оракул</h2>
            <p className="text-center text-gray-400 text-sm mb-8">Выберите свой знак зодиака</p>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-3 gap-3"
            >
                {SIGNS.map((sign, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        whileHover={{ scale: 1.05, borderColor: "rgba(217, 70, 239, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="aspect-[4/5] glass-card rounded-2xl flex flex-col items-center justify-center p-2 text-center cursor-pointer group hover:bg-white/5 transition-all"
                        onClick={() => handleSignClick(sign)}
                    >
                        <span className="text-4xl mb-2 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">{sign.icon}</span>
                        <span className="text-xs font-bold font-display text-gray-200 group-hover:text-primary transition-colors">{sign.name}</span>
                        <span className="text-[9px] text-gray-500 mt-1">{sign.date}</span>
                    </motion.div>
                ))}
            </motion.div>

            {/* Sign Detail Modal */}
            <AnimatePresence>
                {selectedSign && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setSelectedSign(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-4">
                                <span className="text-5xl block mb-2">{selectedSign.icon}</span>
                                <h3 className="text-2xl font-bold text-white">{selectedSign.name}</h3>
                                <p className="text-xs text-gray-400">{selectedSign.date}</p>
                            </div>

                            {/* Free Preview */}
                            <div className="glass-card p-4 rounded-xl mb-4 border border-purple-500/20">
                                <h4 className="font-bold text-purple-300 mb-2">✨ Краткий прогноз</h4>
                                <p className="text-sm text-gray-300">{selectedSign.preview}</p>
                                <p className="text-sm text-gray-300 mt-2">
                                    Звёзды шепчут об удаче в делах любовных. Будьте внимательны к знакам судьбы. Время благоприятно для новых начинаний.
                                </p>
                            </div>

                            {/* Paywall */}
                            {!isPaid ? (
                                <div className="space-y-3">
                                    {paymentUrl ? (
                                        <>
                                            <button
                                                onClick={() => openPaymentUrl(paymentUrl)}
                                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
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
                                        <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Lock size={20} className="text-amber-400" />
                                                <div>
                                                    <h3 className="font-bold text-white text-sm">Полный разбор</h3>
                                                    <p className="text-[10px] text-gray-400">Солнце, Луна, совместимость, прогноз</p>
                                                </div>
                                            </div>

                                            {error && (
                                                <p className="text-red-400 text-xs mb-2">⚠️ {error}</p>
                                            )}

                                            <button
                                                onClick={handlePayment}
                                                disabled={paymentLoading}
                                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {paymentLoading ? (
                                                    <Loader size={18} className="animate-spin" />
                                                ) : (
                                                    <>
                                                        <CreditCard size={16} />
                                                        Получить за 49₽
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center gap-2 text-green-400 bg-green-500/10 p-3 rounded-xl">
                                        <CheckCircle size={18} />
                                        <span className="font-medium text-sm">Полный разбор отправлен в бота!</span>
                                    </div>
                                </motion.div>
                            )}

                            <button
                                onClick={() => setSelectedSign(null)}
                                className="w-full mt-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                ← Назад
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
